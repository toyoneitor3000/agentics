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
        console.log('Checking for duplicate profiles by email...');

        const res = await client.query(`
          SELECT email, COUNT(*), array_agg(id) as ids
          FROM profiles
          WHERE email IS NOT NULL
          GROUP BY email
          HAVING COUNT(*) > 1
      `);

        if (res.rows.length === 0) {
            console.log('No duplicate profiles found.');
        } else {
            console.log('Found duplicates:', res.rows);
            // We found duplicates, let's merge them!
            for (const row of res.rows) {
                const email = row.email;
                const ids = row.ids; // Array of IDs. One is UUID (old), one is String/Text (new BetterAuth) probably.

                // Simple heuristic: The one that matches the 'user' table (BetterAuth) is the "winner".
                // Or the one that looks like a BetterAuth ID (alphanumeric, shorter?) vs UUID.
                // Actually, simply checking which one exists in the 'user' table is best.

                console.log(`Merging profiles for ${email}... IDs: ${ids.join(', ')}`);

                // Find the winner (connected to BetterAuth 'user' table)
                const userCheck = await client.query(`SELECT id FROM "user" WHERE id = ANY($1)`, [ids]);
                if (userCheck.rows.length === 0) {
                    console.log('Warning: None of these profiles are linked to BetterAuth user table?');
                    continue;
                }

                const winnerId = userCheck.rows[0].id; // Assuming only one is active in BetterAuth
                const loserIds = ids.filter(id => id !== winnerId);

                console.log(`Winning ID: ${winnerId} (BetterAuth User)`);
                console.log(`Losing IDs (Old Data): ${loserIds.join(', ')}`);

                for (const loserId of loserIds) {
                    // Move data from loserId to winnerId
                    const tables = [
                        'projects', 'marketplace_items', 'forum_posts', 'comments',
                        'lesson_progress', 'gallery_albums', 'likes', 'photo_likes',
                        'follows', 'notifications', 'enrollments', 'events'
                    ];

                    for (const table of tables) {
                        const col = (table === 'follows' ? 'follower_id' : (table === 'notifications' ? 'recipient_id' : 'user_id'));
                        // Special handling for follows/notifications which have 2 columns

                        if (table === 'follows') {
                            await client.query(`UPDATE follows SET follower_id = $1 WHERE follower_id = $2`, [winnerId, loserId]).catch(e => console.log(`Error updating follows follower: ${e.message}`));
                            await client.query(`UPDATE follows SET following_id = $1 WHERE following_id = $2`, [winnerId, loserId]).catch(e => console.log(`Error updating follows following: ${e.message}`));
                        } else if (table === 'notifications') {
                            await client.query(`UPDATE notifications SET recipient_id = $1 WHERE recipient_id = $2`, [winnerId, loserId]).catch(e => console.log(`Error updating notifications recipient: ${e.message}`));
                            await client.query(`UPDATE notifications SET actor_id = $1 WHERE actor_id = $2`, [winnerId, loserId]).catch(e => console.log(`Error updating notifications actor: ${e.message}`));
                        } else {
                            await client.query(`UPDATE ${table} SET user_id = $1 WHERE user_id = $2`, [winnerId, loserId]).catch(e => console.log(`Error updating ${table}: ${e.message}`));
                        }
                    }

                    // Merge Profile Data (if winner is empty but loser has info)
                    // e.g. winner might have generic avatar, loser has real one.
                    // We'll pull data from loser to winner IF winner is missing it.
                    await client.query(`
                       UPDATE profiles p1
                       SET 
                        full_name = COALESCE(p1.full_name, p2.full_name),
                        avatar_url = COALESCE(p1.avatar_url, p2.avatar_url),
                        bio = COALESCE(p1.bio, p2.bio),
                        role = COALESCE(p1.role, p2.role),
                        xp = p1.xp + p2.xp, -- Sum XP
                        founder_number = COALESCE(p2.founder_number, p1.founder_number) -- Prefer old founder number!
                       FROM profiles p2
                       WHERE p1.id = $1 AND p2.id = $2
                   `, [winnerId, loserId]);

                    // Finally, delete the loser
                    console.log(`Deleting old profile: ${loserId}`);
                    await client.query(`DELETE FROM profiles WHERE id = $1`, [loserId]);
                }
                console.log('Merge complete for', email);
            }
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

run();
