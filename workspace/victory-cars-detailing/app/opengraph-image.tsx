import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Victory Cars Detailing - Premium Auto Care';
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
                    color: 'white',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.15), transparent 70%)',
                    }}
                />

                {/* Decorative Grid */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                        opacity: 0.2,
                        maskImage: 'radial-gradient(ellipse at center, black, transparent)',
                    }}
                />

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 10,
                    }}
                >
                    <div
                        style={{
                            fontSize: 80,
                            fontWeight: 900,
                            color: 'white',
                            marginBottom: 10,
                            textTransform: 'uppercase',
                            letterSpacing: '-0.02em',
                            textShadow: '0 0 40px rgba(6, 182, 212, 0.5)',
                        }}
                    >
                        Victory Cars
                    </div>
                    <div
                        style={{
                            fontSize: 40,
                            fontWeight: 700,
                            color: '#06b6d4',
                            marginBottom: 40,
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                        }}
                    >
                        Detailing & Protection
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            gap: 20,
                        }}
                    >
                        <div style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', fontSize: 24, color: '#94a3b8' }}>Sylex</div>
                        <div style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', fontSize: 24, color: '#94a3b8' }}>Gtechniq</div>
                        <div style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', fontSize: 24, color: '#94a3b8' }}>IGL</div>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
