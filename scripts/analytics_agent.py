
import os
import psycopg2
from dotenv import load_dotenv

# Load Environment Variables
load_dotenv('.env.local')

DB_URL = os.getenv('DATABASE_URL')

def analyze_retention():
    """
    Connects to the database and analyzes video retention rates.
    """
    if not DB_URL:
        print("❌ Error: DATABASE_URL not found.")
        return

    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()

        print("📊 --- SPEEDLIGHT ANALYTICS AGENT --- 📊")
        print("Scaning engagement logs...")

        # 1. TOTAL VIEWS PER VIDEO
        cur.execute("""
            SELECT v.title, COUNT(DISTINCT a.id) as views
            FROM video_analytics a
            JOIN cinema_videos v ON a.video_id = v.id
            WHERE a.event_type = 'start'
            GROUP BY v.title
            ORDER BY views DESC
            LIMIT 5;
        """)
        
        print("\n🏆 Top 5 Most Viewed Videos:")
        for row in cur.fetchall():
            print(f" - {row[0]}: {row[1]} views")

        # 2. RETENTION ANALYSIS (Completion Rate)
        cur.execute("""
            WITH stats AS (
                SELECT 
                    video_id,
                    COUNT(*) FILTER (WHERE event_type = 'start') as starts,
                    COUNT(*) FILTER (WHERE event_type = 'complete') as completions
                FROM video_analytics
                GROUP BY video_id
            )
            SELECT v.title, s.starts, s.completions, 
                   CASE WHEN s.starts > 0 THEN ROUND((s.completions::decimal / s.starts) * 100, 2) ELSE 0 END as retention_rate
            FROM stats s
            JOIN cinema_videos v ON s.video_id = v.id
            WHERE s.starts > 0
            ORDER BY retention_rate DESC;
        """)

        print("\n🎣 Best Retention Rates (Completion %):")
        for row in cur.fetchall():
            print(f" - {row[0]}: {row[3]}% ({row[2]}/{row[1]} completed)")

        # 3. DROP-OFF CURVE (Average)
        print("\n📉 Drop-off Analysis (Global Average):")
        # Conceptual query for drop-off at quartiles
        
        conn.close()
        print("\n✅ Analysis Complete.")

    except Exception as e:
        print(f"❌ Database Error: {e}")

if __name__ == "__main__":
    analyze_retention()
