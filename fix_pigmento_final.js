
const { Pool } = require('pg');

const connectionString = "postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require";
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

async function fixPigmentoFinal() {
    const client = await pool.connect();

    const LEGACY_ID = '271c7aeb-f034-4384-ae06-48169e0929e7';
    const NEW_ID = 'POTt2WyDA8031aFEhFEzqohzNJqXjqzj';
    const REAL_EMAIL = 'designedbypigmento@gmail.com';

    try {
        await client.query('BEGIN');

        console.log('1. Moving gallery_albums from LEGACY to NEW ID...');
        await client.query('UPDATE gallery_albums SET user_id = $1 WHERE user_id = $2', [NEW_ID, LEGACY_ID]);

        console.log('2. Deleting the EMPTY/NEW profile associated with NEW_ID...');
        await client.query('DELETE FROM profiles WHERE id = $1', [NEW_ID]);

        console.log('3. Moving the LEGACY profile (#003) to the NEW_ID...');
        await client.query('UPDATE profiles SET id = $1, email = $2 WHERE id = $3', [NEW_ID, REAL_EMAIL, LEGACY_ID]);

        console.log('4. Deleting the LEGACY user from auth table...');
        await client.query('DELETE FROM "user" WHERE id = $1', [LEGACY_ID]);

        await client.query('COMMIT');
        console.log('✅ FIXED! Pigmento #003 assets and profile transferred.');

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Error applying fix:', e.message, e.detail ? e.detail : '');
    } finally {
        client.release();
        pool.end();
    }
}

fixPigmentoFinal();
