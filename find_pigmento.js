
const { Pool } = require('pg');

const connectionString = "postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require";
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

async function findPigmento() {
    const client = await pool.connect();

    // Find Duplicate Profiles
    const res = await client.query("SELECT * FROM profiles WHERE full_name ILIKE '%Pigmento Design%'");
    console.table(res.rows.map(r => ({
        id: r.id,
        founder_number: r.founder_number,
        email: r.email,
        full_name: r.full_name
    })));

    // Find Users associated with them
    const ids = res.rows.map(r => r.id);
    if (ids.length > 0) {
        const resUsers = await client.query("SELECT * FROM \"user\" WHERE id = ANY($1)", [ids]);
        console.table(resUsers.rows.map(u => ({ id: u.id, email: u.email, name: u.name })));
    }

    client.release();
    pool.end();
}

findPigmento();
