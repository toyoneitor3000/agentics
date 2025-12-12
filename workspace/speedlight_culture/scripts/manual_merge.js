const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Simple .env.local parser
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        if (line.trim().startsWith('#')) return;
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            process.env[key] = value;
        }
    });
}

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        await client.connect();
        console.log('--- MANUAL MERGE START ---');

        const targetId = 'Bt6ow223CAkw20zcQL133zbqIXy17tbr'; // The Active BetterAuth User
        const sourceIds = [
            '9d48323b-ad2e-480e-89c2-8851d241d9d9', // Founder #1
            '0b112f97-f948-4592-ab2e-a3a6724abf0c'  // Founder #2
        ];

        console.log(`Merging Sources [${sourceIds.join(', ')}] INTO Target [${targetId}]`);

        for (const sourceId of sourceIds) {
            const tables = [
                'projects', 'marketplace_items', 'forum_posts', 'comments',
                'lesson_progress', 'gallery_albums', 'likes', 'photo_likes',
                'follows', 'notifications', 'enrollments', 'events'
            ];

            for (const table of tables) {
                // Special handling for follows/notifications which have 2 columns
                if (table === 'follows') {
                    await client.query(`UPDATE follows SET follower_id = $1 WHERE follower_id = $2`, [targetId, sourceId]).catch(e => console.log(`Error updating follows follower: ${e.message}`));
                    await client.query(`UPDATE follows SET following_id = $1 WHERE following_id = $2`, [targetId, sourceId]).catch(e => console.log(`Error updating follows following: ${e.message}`));
                } else if (table === 'notifications') {
                    await client.query(`UPDATE notifications SET recipient_id = $1 WHERE recipient_id = $2`, [targetId, sourceId]).catch(e => console.log(`Error updating notifications recipient: ${e.message}`));
                    await client.query(`UPDATE notifications SET actor_id = $1 WHERE actor_id = $2`, [targetId, sourceId]).catch(e => console.log(`Error updating notifications actor: ${e.message}`));
                } else {
                    await client.query(`UPDATE ${table} SET user_id = $1 WHERE user_id = $2`, [targetId, sourceId]).catch(e => console.log(`Error updating ${table}: ${e.message}`));
                }
            }

            // Merge Profile Stats (Take the BEST stats)
            console.log('Merging profile stats...');
            await client.query(`
               UPDATE profiles p1
               SET 
                xp = p1.xp + p2.xp, -- Sum XP
                founder_number = LEAST(p1.founder_number, p2.founder_number), -- Take lower (better) founder number
                role = CASE WHEN p2.role = 'CEO' THEN 'CEO' ELSE p1.role END
               FROM profiles p2
               WHERE p1.id = $1 AND p2.id = $2
           `, [targetId, sourceId]);

            // Mark source profile as processed/deleted
            // We also need to delete from 'user' table since we created a placeholder there
            console.log(`Deleting old profile and user: ${sourceId}`);
            await client.query(`DELETE FROM profiles WHERE id = $1`, [sourceId]);
            await client.query(`DELETE FROM "user" WHERE id = $1`, [sourceId]);
        }

        console.log('--- MANUAL MERGE COMPLETE ---');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

run();
