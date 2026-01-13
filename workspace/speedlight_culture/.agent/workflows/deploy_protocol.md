---
description: Manual Deploy Protocol for Speedlight Culture
---

# Manual Deploy Protocol (Zero Cost Infrastructure)

**CRITICAL RULE:** NEVER use `git push` expecting an automatic deployment. Netlify Auto-Publish is DISABLED to save build minutes.

## How to Deploy to Production
To update `speedlightculture.com`, the USER or AGENT must execute the following command from the project root:

```bash
npm run deploy
```

## Why?
- We are on Netlify Free Tier (300 mins/month limit).
- We exceed this limit quickly with auto-builds.
- Manual deploy builds locally on the user's machine (Unlimited, Faster, Free) and uploads only static assets.

## Prerequisites (One-time setup)
The user machine must have:
1. `npm install -g netlify-cli`
2. `netlify login`
3. `netlify link` (linked to `speedlightculture`)

## Troubleshooting
If `npm run deploy` fails:
1. Ensure the build passes locally (`npm run build`).
2. Check if the user is logged in (`netlify status`).
