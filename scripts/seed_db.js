
const { Client } = require('pg');

// BYPASS SSL ERROR
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// CORRECT URL from .env.local (us-west-2)
const connectionString = "postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=disable"; // disable sslmode in string to avoid conflicts, handle in object

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        await client.connect();
        console.log('Connected.');

        // 1. Inspect Tables
        const resTables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        const tables = resTables.rows.map(r => r.table_name);
        console.log('Tables found:', tables);

        const mkTable = tables.includes('marketplace_listings') ? 'marketplace_listings' : 'marketplace_items';
        console.log(`Using Marketplace Table: ${mkTable}`);

        // 2. Find a User to attribute content to
        // We look for a profile that has an email (if possible) or just any profile.
        // Since profiles usually link to auth.users, we need a valid UUID.
        // Let's check if we have any profiles.
        const resProfiles = await client.query('SELECT id, full_name FROM profiles LIMIT 1');

        let userId;
        if (resProfiles.rows.length > 0) {
            userId = resProfiles.rows[0].id; // id IS the user_id (linked to auth.users)
            console.log(`Found existing user: ${resProfiles.rows[0].full_name} (${userId})`);
        } else {
            console.log('No profiles found. Cannot seed without a user.');
            // Creating a dummy user is hard without auth.users access rights usually, but we are admin here.
            // Let's try to query auth.users if we have permission
            try {
                const resUsers = await client.query('SELECT id, email FROM auth.users LIMIT 1');
                if (resUsers.rows.length > 0) {
                    userId = resUsers.rows[0].id;
                    console.log(`Found auth user: ${userId}`);
                    // Create profile if missing
                    await client.query(`
                       INSERT INTO public.profiles (id, full_name, username, avatar_url)
                       VALUES ($1, 'Speedlight Official', 'speedlight_admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Speedlight')
                       ON CONFLICT (id) DO NOTHING
                   `, [userId]);
                }
            } catch (e) {
                console.log('Could not access auth.users or create profile:', e.message);
            }
        }

        if (!userId) {
            console.log("CRITICAL: No user found or created. Aborting seed.");
            await client.end();
            return;
        }

        // 3. SEED DATA

        // A. Cinema Videos
        // Table: cinema_videos
        // Schema: id, user_id, title, description, video_url, thumbnail_url, category, format, status
        if (tables.includes('cinema_videos')) {
            console.log('Seeding Cinema Videos...');
            const videos = [
                {
                    title: 'JDM Drift Culture Tokyo',
                    description: 'Underground drifting scene in Tokyo. The essence of street racing.',
                    video_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', // Valid sample
                    thumbnail_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070',
                    category: 'Drifting',
                    format: 'horizontal',
                    status: 'approved'
                },
                {
                    title: 'Porsche 911 GT3 RS Review',
                    description: 'Track day tests with the ultimate driving machine.',
                    video_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
                    thumbnail_url: 'https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070',
                    category: 'Reviews',
                    format: 'horizontal',
                    status: 'approved'
                },
                {
                    title: 'Midnight Run',
                    description: 'Vertical POV run on the highway.',
                    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-driving-in-a-dark-tunnel-2027-large.mp4',
                    thumbnail_url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000',
                    category: 'Street',
                    format: 'vertical',
                    status: 'approved'
                }
            ];

            for (const v of videos) {
                await client.query(`
                    INSERT INTO cinema_videos (user_id, title, description, video_url, thumbnail_url, category, format, status)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                `, [userId, v.title, v.description, v.video_url, v.thumbnail_url, v.category, v.format, v.status]);
            }
        }

        // B. Marketplace Items
        if (tables.includes(mkTable)) {
            console.log(`Seeding ${mkTable}...`);
            // Determine columns based on table name (assuming schema from migration)
            // marketplace_items: user_id, title, description, price, condition, category, images, status
            const items = [
                {
                    title: 'Rines BBS LM 18"',
                    description: 'Originales, 5x114.3. Restaurados en color dorado.',
                    price: 4500000,
                    condition: 'Restaurado',
                    category: 'Rines',
                    images: ['https://images.unsplash.com/photo-1611094392473-8dcb573934fb?q=80&w=1000'],
                    status: 'available'
                },
                {
                    title: 'Turbo Garrett GT2860R',
                    description: 'Nuevo en caja. Ideal para proyectos 300-400hp.',
                    price: 3200000,
                    condition: 'Nuevo',
                    category: 'Motor',
                    images: ['https://images.unsplash.com/photo-1542385434-c7823f66c5fc?q=80&w=1000'],
                    status: 'available'
                }
            ];

            const queryText = mkTable === 'marketplace_listings'
                ? `INSERT INTO marketplace_listings (profile_id, title, description, price, images, status) VALUES ($1, $2, $3, $4, $5, $6)`
                : `INSERT INTO marketplace_items (user_id, title, description, price, condition, category, images, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

            for (const i of items) {
                if (mkTable === 'marketplace_listings') {
                    // Adapt for listings if schema differs (guessing minimal schema based on page.tsx)
                    await client.query(queryText, [userId, i.title, i.description, i.price, i.images, 'available']);
                } else {
                    await client.query(queryText, [userId, i.title, i.description, i.price, i.condition, i.category, i.images, i.status]);
                }
            }
        }

        // C. Events
        if (tables.includes('events')) {
            console.log('Seeding Events...');
            const events = [
                {
                    title: 'Cars & Coffee Bogotá',
                    date_text: 'Dom 15 Oct',
                    time_text: '9:00 AM',
                    location: 'Parque de la 93',
                    description: 'Reunión mensual de súper autos y clásicos.',
                    image: 'https://images.unsplash.com/photo-1532585672230-0086a9be7ce9?q=80&w=2070',
                    type: 'social'
                },
                {
                    title: 'Track Day Tocancipá',
                    date_text: 'Sáb 21 Oct',
                    time_text: '8:00 AM',
                    location: 'Autódromo de Tocancipá',
                    description: 'Día de pista abierto para aficionados. Casco obligatorio.',
                    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070',
                    type: 'racing'
                }
            ];

            for (const e of events) {
                await client.query(`
                    INSERT INTO events (user_id, title, date_text, time_text, location, description, image, type)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 `, [userId, e.title, e.date_text, e.time_text, e.location, e.description, e.image, e.type]);
            }
        }

        console.log('✅ Seed Complete!');
        await client.end();

    } catch (e) {
        console.error('Error:', e);
        await client.end();
    }
}

run();
