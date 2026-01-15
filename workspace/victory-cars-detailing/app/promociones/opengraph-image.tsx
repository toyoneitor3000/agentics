import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Victory Cars Detailing - Bono de Regalo';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#020617',
                    backgroundImage: 'linear-gradient(to bottom right, #020617, #0f172a)',
                    color: 'white',
                    position: 'relative',
                }}
            >
                {/* Background Accents */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-100px',
                        left: '-100px',
                        width: '400px',
                        height: '400px',
                        background: 'rgba(6, 182, 212, 0.2)',
                        filter: 'blur(100px)',
                        borderRadius: '50%',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-100px',
                        right: '-100px',
                        width: '400px',
                        height: '400px',
                        background: 'rgba(6, 182, 212, 0.1)',
                        filter: 'blur(100px)',
                        borderRadius: '50%',
                    }}
                />

                {/* Content Container */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid rgba(255,255,255,0.1)',
                        borderRadius: '30px',
                        padding: '40px 80px',
                        backgroundColor: 'rgba(2, 6, 23, 0.5)',
                        boxShadow: '0 0 50px rgba(6, 182, 212, 0.2)',
                    }}
                >
                    <div
                        style={{
                            fontSize: 30,
                            fontWeight: 700,
                            letterSpacing: '0.2em',
                            color: '#06b6d4', // brand-cyan
                            marginBottom: 20,
                            textTransform: 'uppercase',
                        }}
                    >
                        Victory Cars Detailing
                    </div>

                    <div
                        style={{
                            fontSize: 120,
                            fontWeight: 900,
                            background: 'linear-gradient(to right, #ffffff, #94a3b8)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            lineHeight: 1,
                            marginBottom: 10,
                            textShadow: '0 0 30px rgba(255,255,255,0.3)',
                        }}
                    >
                        20% OFF
                    </div>

                    <div
                        style={{
                            fontSize: 40,
                            color: '#cbd5e1', // slate-300
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            marginBottom: 40,
                        }}
                    >
                        Bono de Regalo Exclusivo
                    </div>

                    {/* Button-like visual */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#06b6d4',
                            borderRadius: '15px',
                            padding: '15px 40px',
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: '#020617',
                            textTransform: 'uppercase',
                        }}
                    >
                        Reclamar Ahora
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
