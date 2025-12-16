
const { Client } = require('pg');

// BYPASS SSL ERROR
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connectionString = "postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=disable";

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        await client.connect();
        console.log('Connected to DB for Migration.');

        // FIX ARTICLES SCHEMA
        console.log('Migrating articles.author_id to TEXT...');

        // 1. Drop Policies
        const policies = [
            'Users can create articles',
            'Users can update their own articles',
            'Users can delete their own articles',
            'Public articles are viewable by everyone'
        ];
        for (const p of policies) {
            await client.query(`DROP POLICY IF EXISTS "${p}" ON articles`);
        }

        // 2. Drop FK if exists
        try {
            await client.query(`ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_author_id_fkey`);
        } catch (e) {
            console.log('FK drop warning:', e.message);
        }

        // 3. Change Column Type
        await client.query(`ALTER TABLE articles ALTER COLUMN author_id TYPE TEXT`);

        // 4. Add FK to profiles
        try {
            await client.query(`ALTER TABLE articles ADD CONSTRAINT articles_author_id_fkey FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE`);
        } catch (e) {
            console.log('FK add warning:', e.message);
        }

        // 5. Recreate Policies (Adapted for TEXT ID)
        await client.query(`CREATE POLICY "Public articles are viewable by everyone" ON articles FOR SELECT USING (published = true)`);
        await client.query(`CREATE POLICY "Users can create articles" ON articles FOR INSERT WITH CHECK (auth.uid()::text = author_id)`);
        await client.query(`CREATE POLICY "Users can update their own articles" ON articles FOR UPDATE USING (auth.uid()::text = author_id)`);
        await client.query(`CREATE POLICY "Users can delete their own articles" ON articles FOR DELETE USING (auth.uid()::text = author_id)`);

        console.log('✅ Articles Schema Fixed.');
        await client.end();

    } catch (e) {
        console.error('Error:', e);
        await client.end();
    }
}

run();
