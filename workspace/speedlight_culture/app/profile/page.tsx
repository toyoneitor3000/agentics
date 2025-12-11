import { createClient } from '@/app/utils/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar, Trophy, Zap, Settings, Edit3 } from 'lucide-react'

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Fetch User Projects
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id);

    // Fetch User Albums (NEW)
    const { data: albums } = await supabase
        .from('gallery_albums')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    // Fetch User Events
    const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id);

    // Default values
    const role = profile?.role || 'Rookie'
    const level = profile?.level || 1
    const xp = profile?.xp || 0
    const location = profile?.location || 'Mundo Digital'
    const joinDate = new Date(user.created_at || Date.now()).toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-0 pb-10">
            {/* Cover Image / Background */}
            <div className="relative h-64 md:h-80 w-full bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2694&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
                <div className="flex flex-col md:flex-row items-end md:items-center gap-6 mb-8">
                    {/* Unique Avatar Frame */}
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#111] bg-[#1a1a1a] overflow-hidden relative z-10 shadow-2xl">
                            {profile?.avatar_url ? (
                                <Image
                                    src={profile.avatar_url}
                                    alt={profile.full_name || 'User'}
                                    width={160}
                                    height={160}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white/20">
                                    {profile?.full_name?.charAt(0) || 'U'}
                                </div>
                            )}
                        </div>
                        {/* Level Badge */}
                        <div className="absolute -bottom-2 -right-2 z-20 bg-[#FF9800] text-black font-black text-sm w-10 h-10 flex items-center justify-center rounded-full border-4 border-[#050505] shadow-lg transform group-hover:scale-110 transition-transform">
                            {level}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 pb-2">
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                            <span className="bg-[#FF9800]/10 text-[#FF9800] border border-[#FF9800]/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {role}
                            </span>
                            {profile?.founder_number && profile.founder_number <= 500 && (
                                <span className="bg-gradient-to-r from-yellow-400 to-amber-600 text-black border border-yellow-500/50 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(255,193,7,0.3)] animate-pulse">
                                    <Trophy className="w-3 h-3" /> FOUNDER #{profile.founder_number}
                                </span>
                            )}
                            {profile?.founder_number && profile.founder_number > 500 && (
                                <span className="text-white/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                    <Trophy className="w-3 h-3" /> MEMBER #{profile.founder_number}
                                </span>
                            )}
                            <span className="text-white/40 text-xs flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {location}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-oswald font-bold uppercase text-white mb-2">
                            {profile?.full_name || user.email?.split('@')[0]}
                        </h1>
                        <p className="text-white/60 text-sm font-roboto-mono max-w-xl">
                            {profile?.bio || 'Entusiasta del automovilismo construyendo su legado en Speedlight Culture.'}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mb-2 md:mb-0">
                        <button className="bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all">
                            <Edit3 className="w-4 h-4" />
                            Editar Perfil
                        </button>
                        <Link href="/settings" className="bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] text-white p-2 rounded-xl transition-all">
                            <Settings className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <div className="bg-[#111] border border-[#222] p-5 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-[#FF9800]/5 rounded-bl-full transition-all group-hover:bg-[#FF9800]/10"></div>
                        <div className="relative z-10">
                            <p className="text-white/40 text-xs uppercase tracking-wider font-medium mb-1">Experiencia</p>
                            <h3 className="text-2xl font-bold font-oswald text-white flex items-end gap-1">
                                {xp} <span className="text-sm text-[#FF9800] mb-1">XP</span>
                            </h3>
                        </div>
                        <Zap className="absolute bottom-4 right-4 w-5 h-5 text-[#FF9800]/20" />
                    </div>

                    <div className="bg-[#111] border border-[#222] p-5 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full transition-all group-hover:bg-blue-500/10"></div>
                        <div className="relative z-10">
                            <p className="text-white/40 text-xs uppercase tracking-wider font-medium mb-1">Proyectos</p>
                            <h3 className="text-2xl font-bold font-oswald text-white">{projects?.length || 0}</h3>
                        </div>
                        <div className="absolute bottom-4 right-4 w-5 h-5 text-blue-500/20">🏎️</div>
                    </div>

                    <div className="bg-[#111] border border-[#222] p-5 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-bl-full transition-all group-hover:bg-purple-500/10"></div>
                        <div className="relative z-10">
                            <p className="text-white/40 text-xs uppercase tracking-wider font-medium mb-1">Álbumes</p>
                            <h3 className="text-2xl font-bold font-oswald text-white">{albums?.length || 0}</h3>
                        </div>
                        <div className="absolute bottom-4 right-4 w-5 h-5 text-purple-500/20">📸</div>
                    </div>

                    <div className="bg-[#111] border border-[#222] p-5 rounded-2xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-white/40 text-xs uppercase tracking-wider font-medium mb-1">Miembro Desde</p>
                            <h3 className="text-lg font-bold font-oswald text-white mt-1">{joinDate}</h3>
                        </div>
                        <Calendar className="absolute bottom-4 right-4 w-5 h-5 text-white/10" />
                    </div>
                </div>

                {/* Content Area */}
                <div className="border-t border-[#222] pt-8 mt-12 pb-20">

                    {/* SECTION 1: PROYECTOS (TALLER) */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-oswald font-bold uppercase text-white mb-6 flex items-center gap-2">
                            <span className="text-[#FF9800]">///</span> Mi Taller (Proyectos)
                        </h2>

                        {projects && projects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((project) => (
                                    <Link key={project.id} href={`/projects/${project.id}`}>
                                        <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden group hover:border-[#FF9800]/50 transition-all cursor-pointer h-full flex flex-col">
                                            <div className="h-48 bg-[#1a1a1a] relative">
                                                {project.cover_image || (project.gallery_images && project.gallery_images[0]) ? (
                                                    <Image
                                                        src={project.cover_image || project.gallery_images[0]}
                                                        alt={project.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center text-white/10 text-4xl font-bold">🏎️</div>
                                                )}
                                            </div>
                                            <div className="p-5 flex-1">
                                                <h3 className="font-oswald font-bold text-lg text-white mb-1 uppercase truncate">{project.title}</h3>
                                                <p className="text-[#FF9800] text-xs font-bold uppercase tracking-wider mb-3">{project.make} {project.model}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                <Link href="/projects/new" className="bg-[#111] border border-[#222] border-dashed rounded-xl flex flex-col items-center justify-center p-6 hover:bg-[#1a1a1a] transition-all group cursor-pointer min-h-[300px]">
                                    <div className="w-12 h-12 rounded-full bg-[#222] flex items-center justify-center text-white/50 group-hover:text-[#FF9800] group-hover:scale-110 transition-all mb-4">+</div>
                                    <span className="text-sm font-bold text-white/50 group-hover:text-white uppercase tracking-wide">Nuevo Proyecto</span>
                                </Link>
                            </div>
                        ) : (
                            <div className="bg-[#111] border border-[#222] border-dashed rounded-3xl p-8 text-center flex flex-col items-center justify-center">
                                <p className="text-white/40 text-sm mb-4">No tienes proyectos de restauración o build log.</p>
                                <Link href="/projects/new"><button className="text-[#FF9800] text-sm font-bold hover:underline">Crear Proyecto</button></Link>
                            </div>
                        )}
                    </div>

                    {/* SECTION 1.5: EVENTOS */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-oswald font-bold uppercase text-white mb-6 flex items-center gap-2">
                            <span className="text-[#FF9800]">///</span> Mis Eventos Publicados
                        </h2>

                        {events && events.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {events.map((event) => (
                                    <div key={event.id} className="bg-[#111] border border-[#222] rounded-xl overflow-hidden group hover:border-[#FF9800]/50 transition-all flex flex-col">
                                        <div className="h-48 bg-[#1a1a1a] relative">
                                            {event.image ? (
                                                <Image
                                                    src={event.image}
                                                    alt={event.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-white/10 text-4xl font-bold">📅</div>
                                            )}
                                            <div className="absolute top-2 right-2 flex gap-2">
                                                <Link href={`/events/${event.id}/edit`} className="bg-black/60 backdrop-blur-md p-2 rounded text-white hover:bg-[#FF9800] hover:text-black transition-colors">
                                                    <Edit3 className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="p-5 flex-1">
                                            <div className="text-[#FF9800] text-xs font-bold uppercase mb-1">{event.date_text || event.date}</div>
                                            <h3 className="font-oswald font-bold text-lg text-white mb-1 uppercase truncate">{event.title}</h3>
                                            <p className="text-white/40 text-xs flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> {event.location}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <Link href="/events/new" className="bg-[#111] border border-[#222] border-dashed rounded-xl flex flex-col items-center justify-center p-6 hover:bg-[#1a1a1a] transition-all group cursor-pointer min-h-[300px]">
                                    <div className="w-12 h-12 rounded-full bg-[#222] flex items-center justify-center text-white/50 group-hover:text-[#FF9800] group-hover:scale-110 transition-all mb-4">+</div>
                                    <span className="text-sm font-bold text-white/50 group-hover:text-white uppercase tracking-wide">Publicar Evento</span>
                                </Link>
                            </div>
                        ) : (
                            <div className="bg-[#111] border border-[#222] border-dashed rounded-3xl p-8 text-center flex flex-col items-center justify-center">
                                <p className="text-white/40 text-sm mb-4">No has publicado eventos aún.</p>
                                <Link href="/events/new"><button className="text-[#FF9800] text-sm font-bold hover:underline">Crear Evento</button></Link>
                            </div>
                        )}
                    </div>

                    {/* SECTION 2: GALERÍAS (ALBUMS) */}
                    <div>
                        <h2 className="text-2xl font-oswald font-bold uppercase text-white mb-6 flex items-center gap-2">
                            <span className="text-blue-500">///</span> Mis Álbumes de Fotos
                        </h2>

                        {albums && albums.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {albums.map((album) => (
                                    <Link key={album.id} href={`/gallery/${album.id}`}>
                                        <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden group hover:border-blue-500/50 transition-all cursor-pointer h-full flex flex-col">
                                            <div className="h-48 bg-[#1a1a1a] relative">
                                                {album.cover_url ? (
                                                    <Image
                                                        src={album.cover_url}
                                                        alt={album.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center text-white/10 text-4xl font-bold">📸</div>
                                                )}
                                                {album.category && (
                                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-white">
                                                        {album.category}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-5 flex-1">
                                                <h3 className="font-oswald font-bold text-lg text-white mb-1 uppercase truncate">{album.title}</h3>
                                                <p className="text-white/40 text-xs mb-3">{new Date(album.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                <Link href="/gallery/new" className="bg-[#111] border border-[#222] border-dashed rounded-xl flex flex-col items-center justify-center p-6 hover:bg-[#1a1a1a] transition-all group cursor-pointer min-h-[250px]">
                                    <div className="w-12 h-12 rounded-full bg-[#222] flex items-center justify-center text-white/50 group-hover:text-blue-500 group-hover:scale-110 transition-all mb-4">+</div>
                                    <span className="text-sm font-bold text-white/50 group-hover:text-white uppercase tracking-wide">Subir Álbum</span>
                                </Link>
                            </div>
                        ) : (
                            <div className="bg-[#111] border border-[#222] border-dashed rounded-3xl p-8 text-center flex flex-col items-center justify-center">
                                <p className="text-white/40 text-sm mb-4">No has compartido fotos de eventos o track days.</p>
                                <Link href="/gallery/new"><button className="text-blue-500 text-sm font-bold hover:underline">Subir Fotos</button></Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}
