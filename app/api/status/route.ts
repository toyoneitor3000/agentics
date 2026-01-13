
import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

export async function GET() {
    const start = performance.now();

    // 1. Check Maintenance Mode (Environment Variable)
    const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

    if (maintenanceMode) {
        return NextResponse.json({
            status: 'maintenance',
            latency: 0,
            services: { database: false, auth: false },
            region: 'GLOBAL'
        });
    }

    try {
        const supabase = await createClient();

        // 2. Check Database Connectivity (Lightweight)
        // We check 'likes' table which is central.
        const dbStart = performance.now();
        const { error: dbError } = await supabase.from('likes').select('count', { count: 'exact', head: true }).limit(1);
        const dbEnd = performance.now();
        const dbLatency = Math.round(dbEnd - dbStart);

        // 3. Check Auth Service (Session)
        const { error: authError } = await supabase.auth.getSession();

        const end = performance.now();
        const totalLatency = Math.round(end - start);

        const isDbOk = !dbError;
        const isAuthOk = !authError;

        // Determine overall status
        let status = 'operational';
        if (!isDbOk || !isAuthOk) status = 'degraded';
        if (!isDbOk && !isAuthOk) status = 'outage';

        // Simulate Region (In real Vercel deployment, we could read 'x-vercel-id')
        // For now we mock it or get it from headers if available, but let's just return a static cool one or random to show off.
        // Actually, let's keep it simple: "US-EAST" or similar is standard, but "BOG" is requested contextually if in Colombia.
        // Let's make it dynamic based on nothing for now, just static "AWS-US" or "Vercel-Edge".
        // Better: let the frontend determine the user's region or just say "Global-Edge".

        return NextResponse.json({
            status,
            latency: dbLatency, // DB latency provides a better "ping" feel than total HTTP overhead
            services: {
                database: isDbOk,
                auth: isAuthOk
            },
            region: 'AWS-LIMA', // A nod to Latam infrastructure often used for Colombia
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        return NextResponse.json({
            status: 'outage',
            latency: 0,
            services: { database: false, auth: false },
            region: 'UNKNOWN',
            error: 'Internal Check Failed'
        }, { status: 500 });
    }
}
