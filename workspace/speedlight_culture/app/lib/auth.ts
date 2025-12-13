import { betterAuth } from "better-auth";
import { Pool } from "pg";

console.log("Initializing BetterAuth with URL:", process.env.DATABASE_URL?.split('@')[1]); // Log DB host only for privacy

export const auth = betterAuth({
    debug: true,
    database: new Pool({
        // Sanitize connection string to remove sslmode=require if present, 
        // as it conflicts with explicit ssl config below and causes SELF_SIGNED_CERT_IN_CHAIN
        connectionString: process.env.DATABASE_URL?.replace("sslmode=require", ""),
        ssl: {
            rejectUnauthorized: false
        }
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
    },
    trustedOrigins: ["http://localhost:3000", "https://speedlightculture.com", "https://www.speedlightculture.com"],
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET,
});
