const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkProject() {
    const { data } = await supabase.from('projects').select('user_id').limit(1);
    if (data && data.length > 0) {
        console.log('Project User ID:', data[0].user_id, 'Type:', typeof data[0].user_id);
        // Valid UUID check
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data[0].user_id);
        console.log('Is UUID?', isUUID);
    } else {
        console.log('No projects found.');
    }
}
checkProject();
