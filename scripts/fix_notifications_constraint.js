const { Client } = require('pg');

const connectionString = "postgresql://postgres:Pigmelonn45.@db.gwxhkhalmixohsvxfbva.supabase.co:5432/postgres";

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function fixConstraint() {
    try {
        await client.connect();
        console.log('Connected to DB...');

        // 1. Get current constraint definition
        const res = await client.query(`
            SELECT pg_get_constraintdef(c.oid) AS constraint_def
            FROM pg_constraint c
            JOIN pg_namespace n ON n.oid = c.connamespace
            WHERE c.conname = 'notifications_target_type_check';
        `);

        if (res.rows.length > 0) {
            console.log('Current constraint:', res.rows[0].constraint_def);

            // 2. Drop the old constraint
            console.log('Dropping old constraint...');
            await client.query(`ALTER TABLE notifications DROP CONSTRAINT notifications_target_type_check`);

            // 3. Add new constraint with 'news' included
            // Assuming the old one looked like CHECK (target_type = ANY (ARRAY['post'::text, 'comment'::text, ...]))
            // I'll reconstruct it by extracting current values and adding 'news'.
            // OR simpler: Just allow specific text values knowing the system.
            // Let's parse the output or just overwrite it with a known good Super Set.
            // Common types: 'post', 'comment', 'user', 'system', 'project', 'news'

            const oldDef = res.rows[0].constraint_def;
            let newValues = "'news'";

            // Extract existing values from strings like: CHECK ((target_type = ANY (ARRAY['post'::text, 'comment'::text])))
            // or CHECK (target_type IN ('post', 'comment'))

            // Regex to find 'quoted_words'
            const matches = oldDef.match(/'[^']+'/g);
            if (matches) {
                const unique = new Set(matches);
                unique.add("'news'");
                newValues = Array.from(unique).join(', ');
            } else {
                // Fallback if regex fails (unlikely for standard check constraints)
                newValues = "'post', 'comment', 'user', 'system', 'project', 'news', 'cinema', 'marketplace', 'workshop', 'event'";
            }

            console.log(`Adding new constraint values: ${newValues}`);
            await client.query(`
                ALTER TABLE notifications 
                ADD CONSTRAINT notifications_target_type_check 
                CHECK (target_type IN (${newValues}))
            `);

            console.log('✅ Constraint updated successfully.');

        } else {
            console.log('Constraint not found. Adding it fresh...');
            await client.query(`
                ALTER TABLE notifications 
                ADD CONSTRAINT notifications_target_type_check 
                CHECK (target_type IN ('post', 'comment', 'user', 'system', 'project', 'news', 'cinema', 'marketplace', 'workshop', 'event'))
            `);
            console.log('✅ Constraint created.');
        }

        await client.end();
    } catch (err) {
        console.error('❌ Failed to fix constraint:', err);
    }
}

fixConstraint();
