
const { Pool } = require('pg');

const connectionString = "postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require";
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

async function restoreEmails() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        console.log('🔄 Fetching original emails from Supabase Auth (auth.users)...');
        const resAuth = await client.query('SELECT id, email FROM auth.users');

        console.log(`Found ${resAuth.rowCount} original users.`);

        let updatedCount = 0;

        for (const authUser of resAuth.rows) {
            const { id, email } = authUser;

            // Check if this user exists in our NEW table as a 'legacy' entry
            const resLegacy = await client.query(
                'SELECT * FROM "user" WHERE id = $1 AND email LIKE \'legacy_%\'',
                [id]
            );

            if (resLegacy.rowCount > 0) {
                console.log(`⚡️ Restoring email for ID ${id.slice(0, 8)}...: ${resLegacy.rows[0].email} -> ${email}`);

                // 1. Update public.user (BetterAuth)
                await client.query(
                    'UPDATE "user" SET email = $1, email_verified = true WHERE id = $2',
                    [email, id]
                );

                // 2. Update public.profiles (For display consistency)
                await client.query(
                    'UPDATE profiles SET email = $1 WHERE id = $2',
                    [email, id]
                );

                updatedCount++;
            }
        }

        await client.query('COMMIT');
        console.log(`✅ SUCCESS! Restored real emails for ${updatedCount} users.`);
        console.log('👉 These users can now Log In with Google and will automatically link to their Founder Profile.');

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Error executing restore:', e);
    } finally {
        client.release();
        pool.end();
    }
}

restoreEmails();
