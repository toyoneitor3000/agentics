const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
    const { data, error } = await supabase
        .from('cinema_videos')
        .select('archived')
        .limit(1);

    if (error) {
        console.log("Error checking archived column (likely does not exist):", error.message);
    } else {
        console.log("Column 'archived' exists.");
    }
}

checkColumns();
