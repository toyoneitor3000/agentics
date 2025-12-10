import { createClient } from '@/app/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Camera, Edit2, Share2, Trash2 } from 'lucide-react';
import { ProjectGallery } from '@/app/components/ProjectGallery';

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient();

    // 1. Fetch Project
    const { data: project } = await supabase
        .from('projects')
        .select('*, profiles(*)')
        .eq('id', id)
        .single();

    if (!project) return notFound();

    // 2. Check Ownership
    const { data: { user } } = await supabase.auth.getUser();
    const isOwner = user?.id === project.user_id;

    // Determine Display Image (Cover or First Gallery or Null)
    const displayImage = project.cover_image || (project.gallery_images && project.gallery_images.length > 0 ? project.gallery_images[0] : null);

    return (
        <div className="min-h-screen bg-[#050505] text-white py-12">

            {/* Hero / Cover */}
            <div className="relative h-[50vh] w-full bg-black overflow-hidden">
                {displayImage ? (
                    <Image
                        src={displayImage}
                        alt={project.title}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-[#111] flex items-center justify-center">
                        <Camera className="w-20 h-20 text-white/10" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20">
                    <div className="container mx-auto">
                        <Link href="/profile" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 text-sm uppercase tracking-widest transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Volver al Garaje
                        </Link>
                        <h1 className="text-4xl md:text-7xl font-oswald font-bold uppercase mb-2 leading-none">
                            {project.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-[#FF9800] font-bold uppercase tracking-wider text-sm md:text-base">
                            <span>{project.make}</span>
                            <span>•</span>
                            <span>{project.model}</span>
                            <span>•</span>
                            <span>{project.year}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Main Content: Story & Gallery */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Story Section */}
                    <section>
                        <h2 className="text-2xl font-oswald font-bold uppercase mb-6 flex items-center gap-3">
                            <span className="w-8 h-1 bg-[#FF9800]"></span>
                            La Historia
                        </h2>
                        <p className="text-white/70 leading-relaxed text-lg whitespace-pre-line font-light">
                            {project.description || "El dueño aún no ha contado la historia de este proyecto."}
                        </p>
                    </section>

                    {/* Gallery Section */}
                    <ProjectGallery
                        projectId={project.id}
                        images={project.gallery_images || []}
                        isOwner={isOwner}
                    />

                </div>

                {/* Sidebar: Specs & Owner */}
                <div className="space-y-8">

                    {/* Owner Card */}
                    <div className="bg-[#111] border border-[#222] p-6 rounded-2xl">
                        <h3 className="text-white/40 uppercase text-xs font-bold tracking-widest mb-4">Propietario</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-[#222] overflow-hidden">
                                {project.profiles?.avatar_url ? (
                                    <Image src={project.profiles.avatar_url} alt="Owner" width={64} height={64} className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/20 font-bold text-xl">
                                        {project.profiles?.full_name?.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">{project.profiles?.full_name}</h4>
                                <p className="text-[#FF9800] text-xs uppercase font-bold">{project.profiles?.role || 'Miembro'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {isOwner ? (
                        <div className="grid grid-cols-2 gap-4">
                            <button className="bg-[#222] hover:bg-[#333] text-white py-4 rounded-xl font-bold uppercase text-xs flex items-center justify-center gap-2 transition-colors">
                                <Edit2 className="w-4 h-4" /> Editar Info
                            </button>
                            <button className="bg-red-900/20 hover:bg-red-900/40 text-red-500 py-4 rounded-xl font-bold uppercase text-xs flex items-center justify-center gap-2 transition-colors border border-red-900/30">
                                <Trash2 className="w-4 h-4" /> Eliminar
                            </button>
                        </div>
                    ) : (
                        <button className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-black py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(255,152,0,0.2)]">
                            <Share2 className="w-4 h-4" /> Compartir Proyecto
                        </button>
                    )}

                    {/* Specs List (Placeholder for now) */}
                    <div className="bg-[#111] border border-[#222] p-6 rounded-2xl">
                        <h3 className="text-white/40 uppercase text-xs font-bold tracking-widest mb-6">Especificaciones</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-[#222] pb-2">
                                <span className="text-white/60 text-sm">Motor</span>
                                <span className="font-bold text-sm">Stock + Stage 1</span>
                            </div>
                            <div className="flex justify-between border-b border-[#222] pb-2">
                                <span className="text-white/60 text-sm">Suspensión</span>
                                <span className="font-bold text-sm">Eibach Pro Kit</span>
                            </div>
                            {/* In the future we will map this from project.specs jsonb */}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
