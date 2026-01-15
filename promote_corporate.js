
const { Client } = require('pg');

const connectionString = 'postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

const client = new Client({
    connectionString: connectionString,
});

async function run() {
    try {
        await client.connect();

        const email = 'speedlightculture@gmail.com';
        const newName = 'Speedlight Culture';
        const newRole = 'CEO';

        console.log(`Promoting ${email}...`);

        const res = await client.query(`
            UPDATE profiles 
            SET full_name = $1, role = $2
            WHERE email = $3
            RETURNING id, full_name, role, founder_number
        `, [newName, newRole, email]);

        if (res.rowCount > 0) {
            console.log("Success! Updated profile:");
            console.table(res.rows);
        } else {
            console.log("User not found via email.");
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

run();
