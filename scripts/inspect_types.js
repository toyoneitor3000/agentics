const { Client } = require('pg');

const connectionString = "postgresql://postgres:Pigmelonn45.@db.gwxhkhalmixohsvxfbva.supabase.co:5432/postgres";

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function checkTypes() {
    try {
        await client.connect();
        console.log('Connected.');

        const res = await client.query(`
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name IN ('notifications', 'profiles', 'speedlight_news')
            ORDER BY table_name, column_name;
        `);

        console.table(res.rows);

        await client.end();
    } catch (err) {
        console.error(err);
    }
}

checkTypes();
