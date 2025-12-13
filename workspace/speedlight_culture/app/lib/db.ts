import { Pool } from 'pg';
import dns from 'dns';
import { promisify } from 'util';

const resolve4 = promisify(dns.resolve4);

let pool: Pool | null = null;

async function getPool() {
    if (pool) return pool;

    let connectionString = process.env.DATABASE_URL;
    let isDirect = false;

    // 1. Attempt to switch to Direct Connection (Session Mode, port 5432)
    if (connectionString && connectionString.includes(':6543')) {
        try {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            if (supabaseUrl) {
                const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
                if (projectRef) {
                    const match = connectionString.match(/postgres:\/\/([^:]+):([^@]+)@/);
                    if (match) {
                        const password = match[2];
                        // Construct direct URL with user 'postgres'
                        connectionString = `postgres://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`;
                        isDirect = true;
                        console.log('Switched to Direct Connection for Server Actions (port 5432)');
                    }
                }
            }
        } catch (e) {
            console.warn('Failed to construct direct connection string, falling back to env var', e);
        }
    }

    // 2. Force IPv4 Resolution to avoid EHOSTUNREACH on IPv6
    if (connectionString) {
        try {
            // Extract hostname
            const match = connectionString.match(/@([^:]+):/);
            if (match) {
                const hostname = match[1];
                // Resolve IPv4
                const ips = await resolve4(hostname);
                if (ips && ips.length > 0) {
                    const ip = ips[0];
                    // Replace hostname with IP in connection string
                    connectionString = connectionString.replace(hostname, ip);
                    console.log(`Resolved ${hostname} to ${ip} (IPv4)`);
                }
            }
        } catch (e) {
            console.warn('DNS resolution failed, proceeding with original hostname', e);
        }
    }

    // Remove sslmode=require if present
    connectionString = connectionString?.replace("sslmode=require", "");

    pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    return pool;
}

export const query = async (text: string, params?: any[]) => {
    const p = await getPool();
    return p.query(text, params);
};
