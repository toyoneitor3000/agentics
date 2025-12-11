import { createClient } from '@/app/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, Zap } from 'lucide-react';
import PageHero from '@/app/components/PageHero';

export default async function ProjectsPage() {
    const supabase = await createClient();

    // Fetch ALL projects ordered by newest
    const { data: projects } = await supabase
        .from('projects')
        .select('*, profiles(username, avatar_url, full_name)')
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-12">
            <PageHero
                title="Speedlight Projects"
                subtitle="El Garaje Virtual"
                description="La colección definitiva de builds de la comunidad. Inspírate, comparte y documenta tu proceso."
                image="https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070&auto=format&fit=crop" // Garage Build
                action={{
                    label: "Subir mi Proyecto",
                    href: "/projects/new"
                }}
            />
            <div className="container mx-auto px-6 mt-12">

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects && projects.length > 0 ? (
                        projects.map((project) => (
                            <Link key={project.id} href={`/projects/${project.id}`} className="group">
                                <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden hover:border-[#FF9800]/50 transition-all cursor-pointer h-full flex flex-col shadow-lg">

                                    {/* Image Wrapper */}
                                    <div className="relative h-64 bg-[#1a1a1a] overflow-hidden">
                                        {project.cover_image || (project.gallery_images && project.gallery_images[0]) ? (
                                            <Image
                                                src={project.cover_image || project.gallery_images[0]}
                                                alt={project.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-white/10 group-hover:text-[#FF9800]/20 transition-colors">
                                                <Camera className="w-16 h-16" />
                                            </div>
                                        )}

                                        {/* Overlay Stats */}
                                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/50 to-transparent p-4 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="text-xs font-bold text-[#FF9800] uppercase tracking-wider">
                                                Ver Detalles
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="mb-auto">
                                            <h3 className="text-xl font-oswald font-bold text-white mb-1 uppercase leading-tight group-hover:text-[#FF9800] transition-colors">{project.title}</h3>
                                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">
                                                {project.make} <span className="text-[#FF9800]">•</span> {project.model}
                                            </p>
                                            <p className="text-white/60 text-sm line-clamp-3 mb-4 font-light">
                                                {project.description || "Sin descripción."}
                                            </p>
                                        </div>

                                        {/* Author Footer */}
                                        <div className="flex items-center gap-3 pt-4 border-t border-[#222] mt-4">
                                            <div className="w-8 h-8 rounded-full bg-[#333] overflow-hidden relative">
                                                {project.profiles?.avatar_url ? (
                                                    <Image src={project.profiles.avatar_url} alt="User" fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs font-bold">U</div>
                                                )}
                                            </div>
                                            <div className="text-xs">
                                                <p className="text-white font-bold">{project.profiles?.full_name || 'Miembro Speedlight'}</p>
                                                <p className="text-white/30 truncate max-w-[150px]">Garage Owner</p>
                                            </div>
                                            <div className="ml-auto text-yellow-500 flex items-center gap-1 text-xs font-bold">
                                                <Zap className="w-3 h-3" /> {project.likes_count || 0}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-[#222] rounded-full flex items-center justify-center text-white/20 mb-6">
                                <Camera className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold font-oswald text-white mb-2">El garaje está vacío</h2>
                            <p className="text-white/40 max-w-md mx-auto mb-8">
                                Sé el primero en inmortalizar tu proyecto en la galería oficial.
                            </p>
                            <Link href="/projects/new">
                                <button className="bg-[#FF9800] text-black font-bold px-8 py-3 rounded-xl uppercase tracking-wide hover:shadow-[0_0_20px_rgba(255,152,0,0.3)] transition-all">
                                    Inaugurar la Galería
                                </button>
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
