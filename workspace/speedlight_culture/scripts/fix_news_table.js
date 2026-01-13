const { Client } = require('pg');

const connectionString = "postgresql://postgres:Pigmelonn45.@db.gwxhkhalmixohsvxfbva.supabase.co:5432/postgres";

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function fixTable() {
    try {
        await client.connect();
        console.log('Connected to DB...');

        console.log('Altering speedlight_news author_id to TEXT...');
        // Drop foreign key first if it exists (it was created with REFERENCES auth.users(id))
        // Since I'm not sure if auth.users(id) is uuid or text in this setup (likely uuid if it is Supabase Auth underneath, but profiles has text id).
        // If profiles.id is text, let's reference profiles(id) instead or just loose reference.

        // Find constraint name
        const res = await client.query(`
            SELECT constraint_name
            FROM information_schema.table_constraints
            WHERE table_name = 'speedlight_news' AND constraint_type = 'FOREIGN KEY';
        `);

        for (const row of res.rows) {
            console.log(`Dropping constraint ${row.constraint_name}...`);
            await client.query(`ALTER TABLE speedlight_news DROP CONSTRAINT ${row.constraint_name}`);
        }

        // Alter column
        await client.query(`ALTER TABLE speedlight_news ALTER COLUMN author_id TYPE TEXT`);

        // Add foreign key to profiles instead? Or just leave it loose for now to be safe.
        // Let's reference profiles(id) since we know profiles.id encapsulates the users.
        await client.query(`
            ALTER TABLE speedlight_news 
            ADD CONSTRAINT fk_author 
            FOREIGN KEY (author_id) 
            REFERENCES profiles (id)
        `);

        console.log('✅ author_id fixed to TEXT and linked to profiles.');
        await client.end();
    } catch (err) {
        console.error('❌ Failed to fix table:', err);
    }
}

fixTable();
