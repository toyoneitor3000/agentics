const { Client } = require('pg');

const connectionString = "postgresql://postgres:Pigmelonn45.@db.gwxhkhalmixohsvxfbva.supabase.co:5432/postgres";

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function cleanNews() {
    try {
        await client.connect();
        console.log('Connected to DB...');

        // 1. Fetch all news
        const { rows } = await client.query(`SELECT id, title, content FROM speedlight_news`);

        console.log(`Found ${rows.length} news items.`);

        for (const news of rows) {
            // 2. Clean the content: remove "Author: ..." and "Commit: ..." patterns
            let cleanContent = news.content;

            // Remove patterns like "Author: Toyoneitor." or "Author: SomeName."
            cleanContent = cleanContent.replace(/Author:\s*[^.]+\./gi, '');
            // Remove patterns like "Commit: 2d887e8" or "Commit: abcd123"
            cleanContent = cleanContent.replace(/Commit:\s*[a-f0-9]+/gi, '');
            // Remove "Update details:" prefix if present
            cleanContent = cleanContent.replace(/Update details:\s*/gi, '');
            // Clean up extra spaces/periods
            cleanContent = cleanContent.replace(/\s{2,}/g, ' ').trim();

            // 3. Update in DB
            if (cleanContent !== news.content) {
                await client.query(
                    `UPDATE speedlight_news SET content = $1 WHERE id = $2`,
                    [cleanContent, news.id]
                );
                console.log(`✅ Cleaned news ID: ${news.id}`);
            } else {
                console.log(`⏭️ No changes needed for ID: ${news.id}`);
            }
        }

        console.log('🎉 All news cleaned successfully.');
        await client.end();
    } catch (err) {
        console.error('❌ Failed to clean news:', err);
    }
}

cleanNews();
