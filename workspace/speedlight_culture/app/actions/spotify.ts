"use server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getAccessToken() {
    if (!CLIENT_ID || !CLIENT_SECRET) {
        console.warn("Spotify credentials not found. Using mock data.");
        return null;
    }

    if (cachedToken && Date.now() < tokenExpiry) {
        return cachedToken;
    }

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials'
        });

        const data = await response.json();
        if (data.access_token) {
            cachedToken = data.access_token;
            tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Buffer 1 min
            return cachedToken;
        }
    } catch (e) {
        console.error("Failed to authenticate with Spotify", e);
    }
    return null;
}

export async function searchSpotifyTrack(query: string) {
    if (!query || query.length < 2) return [];

    const token = await getAccessToken();

    // FALLBACK MOCK DATA (If no API Keys)
    if (!token) {
        // Return some "fake" results that look real so the UI can be tested
        return [
            { id: 'mock1', name: 'Midnight City', artist: 'M83', album: 'Hurry Up, We\'re Dreaming', cover: 'https://i.scdn.co/image/ab67616d0000b273297a76c5ae34f4175394da8a' },
            { id: 'mock2', name: 'Nightcall', artist: 'Kavinsky', album: 'OutRun', cover: 'https://i.scdn.co/image/ab67616d0000b273b0671603ba759d57a419eb50' },
            { id: 'mock3', name: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', cover: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36' },
            { id: 'mock4', name: query, artist: 'Unknown Artist', album: 'Demo Album', cover: '' }
        ];
    }

    try {
        const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.tracks && data.tracks.items) {
            return data.tracks.items.map((track: any) => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                cover: track.album.images[0]?.url || '',
                preview_url: track.preview_url
            }));
        }
    } catch (e) {
        console.error("Spotify Search Error", e);
    }

    return [];
}
