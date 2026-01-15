---
description: Manual Deploy Protocol for Speedlight Culture
---

# Manual Deploy Protocol (Zero Cost Infrastructure)

**CRITICAL RULE:** We use Vercel for deployment to avoid Netlify's strict bandwidth limits on the free tier.

## How to Deploy to Production
To update `speedlightculture.com`, the USER or AGENT must execute the following command from the project root:

```bash
npm run deploy
```

## Why Vercel?
- Netlify Free Tier has very low bandwidth limits (100GB/month) and build minutes.
- Vercel handles Next.js projects more efficiently and usually offers better performance for our specific stack.

## Prerequisites (One-time setup)
The user machine must have:
1. `npx vercel login` (if not already logged in)
2. `npx vercel link` (linked to `slculture` project)

## Troubleshooting
If `npm run deploy` fails:
1. Ensure the build passes locally (`npm run build`).
2. Check if the user is logged in (`npx vercel whoami`).
3. Verify environment variables in Vercel Dashboard match `.env.local`.
