
const { Client } = require('pg');

const connectionString = 'postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

const client = new Client({
    connectionString: connectionString,
});

async function run() {
    try {
        await client.connect();

        console.log("Starting re-order of founder_numbers...");

        await client.query('BEGIN');

        // 1. Fetch all profiles sorted by created_at to maintain seniority
        // If created_at is identical (rare), fallback to ID or current founder_number
        const res = await client.query(`
            SELECT id, full_name, founder_number, created_at 
            FROM profiles 
            ORDER BY created_at ASC, founder_number ASC
        `);

        const profiles = res.rows;
        console.log(`Found ${profiles.length} profiles to reorder.`);

        // 2. Temporarily shift all founder_numbers to avoid unique constraint collisions
        // Using a large offset
        console.log("Shifting numbers to temporary range...");
        await client.query(`UPDATE profiles SET founder_number = founder_number + 1000000`);

        // 3. Update to correct sequential numbers
        console.log("Applying new sequential numbers...");
        for (let i = 0; i < profiles.length; i++) {
            const profile = profiles[i];
            const newNumber = i + 1;

            await client.query(`
                UPDATE profiles 
                SET founder_number = $1 
                WHERE id = $2
            `, [newNumber, profile.id]);

            console.log(`${profile.full_name}: ${profile.founder_number} -> ${newNumber}`);
        }

        // 4. Reset the sequence
        // First find the sequence name associated with the column
        const seqRes = await client.query(`
            SELECT pg_get_serial_sequence('profiles', 'founder_number') as seq_name
        `);

        const seqName = seqRes.rows[0]?.seq_name;

        if (seqName) {
            const nextVal = profiles.length + 1;
            console.log(`Resetting sequence '${seqName}' to ${nextVal}`);
            // is_called = false means next value call will return nextVal. 
            // setval(seq, val, is_called) -> setval(seq, 11, false) -> next val is 11.
            // If we have 10 users, next user should be 11. 
            // So we set to 11 and is_called false? Or set to 10 and next one increments?
            // Usually setval('seq', 10, true) -> next is 11.
            await client.query(`SELECT setval($1, $2, true)`, [seqName, profiles.length]);
        } else {
            console.log("No sequence found for founder_number (might not be SERIAL/IDENTITY).");
        }

        await client.query('COMMIT');
        console.log("Successfully reordered founder numbers!");

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error executing update:', err);
    } finally {
        await client.end();
    }
}

run();
