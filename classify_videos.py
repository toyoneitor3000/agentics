
import os
import requests
import psycopg2
from urllib.parse import urlparse

# Database connection
RAW_DB_URL = os.environ.get("DATABASE_URL")
CLOUDFLARE_ACCOUNT_ID = os.environ.get("CLOUDFLARE_ACCOUNT_ID")
CLOUDFLARE_API_TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN")

if not RAW_DB_URL:
    print("Error: DATABASE_URL is not set.")
    exit(1)

# Fix for Supabase Transaction Pooler URL in Psycopg2
# Convert port 6543 -> 5432 (Session) or just strip parameters if needed
# Psycopg2 works best with the Session connection string (port 5432) for simple scripts
# But if we must use 6543, we need to handle "pgbouncer=true" carefully or remove it.
if "?" in RAW_DB_URL:
    DB_URL = RAW_DB_URL.split("?")[0]
else:
    DB_URL = RAW_DB_URL
    
print(f"Connecting to DB...")

def get_cloudflare_id(url):
    if not url:
        return None
    import re
    # Match patterns like:
    # https://iframe.videodelivery.net/VIDEO_ID
    # https://watch.cloudflarestream.com/VIDEO_ID
    # https://customer-xyz.cloudflarestream.com/VIDEO_ID/manifest/video.m3u8
    regex = r"(?:cloudflarestream\.com|videodelivery\.net)\/([a-zA-Z0-9]+)"
    match = re.search(regex, url)
    return match.group(1) if match else None

def get_video_format_from_cloudflare(video_id):
    if not CLOUDFLARE_ACCOUNT_ID or not CLOUDFLARE_API_TOKEN:
        print("Skipping Cloudflare check (Missing Credentials)")
        return None
    
    api_url = f"https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/stream/{video_id}"
    headers = {
        "Authorization": f"Bearer {CLOUDFLARE_API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(api_url, headers=headers, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                meta = data['result']['input']
                width = meta.get('width', 0)
                height = meta.get('height', 0)
                
                if height > width:
                    return 'vertical'
                elif width > height:
                    return 'horizontal'
                else:
                    return 'square' # Treat as horizontal or special case? Let's say horizontal for cinema.
        else:
            print(f"CF Error {response.status_code} for {video_id}")
    except Exception as e:
        print(f"Error checking CF: {e}")
    
    return None

def main():
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        # Get all videos
        cur.execute("SELECT id, video_url, title FROM cinema_videos")
        videos = cur.fetchall()
        
        print(f"Found {len(videos)} videos. analyzing...")
        
        updated_count = 0
        
        for video_id, url, title in videos:
            print(f"Checking: {title}...")
            
            format_type = 'horizontal' # Default
            
            # 1. Check Cloudflare
            cf_id = get_cloudflare_id(url)
            if cf_id:
                detected = get_video_format_from_cloudflare(cf_id)
                if detected:
                    format_type = detected
                    print(f"  -> Detected Cloudflare: {format_type}")
                else:
                    print("  -> Could not detect from Cloudflare API, defaulting.")
            
            # 2. Heuristic for Native/YouTube if needed (difficult without downloading)
            # For now, we trust Cloudflare heavily as that's the main premium source.
            # If YouTube, we assume Horizontal for now unless User manually changes it later.
            
            # Update DB
            cur.execute("UPDATE cinema_videos SET format = %s WHERE id = %s", (format_type, video_id))
            updated_count += 1
            
        conn.commit()
        cur.close()
        conn.close()
        print(f"Successfully classified {updated_count} videos.")
        
    except Exception as e:
        print(f"Database Error: {e}")

if __name__ == "__main__":
    main()
