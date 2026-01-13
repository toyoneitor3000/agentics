
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function checkUsers() {
    try {
        const client = await pool.connect();

        // Check specific "legacy" emails in user table
        const resUsers = await client.query("SELECT * FROM \"user\" WHERE email LIKE '%legacy%' LIMIT 5");
        console.log("--- USERS TABLE (Legacy emails) ---");
        console.table(resUsers.rows.map(r => ({ id: r.id, email: r.email, name: r.name })));

        // Check profiles for these IDs
        if (resUsers.rows.length > 0) {
            const ids = resUsers.rows.map(r => r.id);
            const resProfiles = await client.query("SELECT * FROM profiles WHERE id = ANY($1::text[])", [ids]);
            console.log("--- PROFILES TABLE (Matching IDs) ---");
            console.table(resProfiles.rows.map(r => ({ id: r.id, full_name: r.full_name, founder_number: r.founder_number })));
        }

        client.release();
    } catch (err) {
        console.error("Error executing query", err.stack);
    } finally {
        await pool.end();
    }
}

checkUsers();
