
const { Pool } = require('pg');

const connectionString = "postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require";
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

async function restoreEmailsRetry() {
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

                // 1. Update public.user (BetterAuth) - Correct column name `emailVerify` is usually `emailVerified` boolean OR `email_verified` (bool). 
                // Wait, BetterAuth default schema uses `emailVerified` (boolean) usually. But Supabase might map differently?
                // Actually, BetterAuth default is `emailVerified` (boolean).
                // Let's check table columns first to be safe or just try updating ONLY email.

                await client.query(
                    'UPDATE "user" SET email = $1 WHERE id = $2',
                    [email, id]
                );
                // Also set verified if column exists? Let's skip to avoid error. The email coming from Auth.users IS verified usually.

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

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Error executing restore:', e);
    } finally {
        client.release();
        pool.end();
    }
}

restoreEmailsRetry();
