import { createClient } from '@/app/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Camera, Edit2, Share2, Trash2, Star } from 'lucide-react';
import { ProjectGallery } from '@/app/components/ProjectGallery';
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import ProjectContextMenu from '@/app/components/ProjectContextMenu';
import ProjectSocial from '@/app/components/ProjectSocial';
import ProjectStats from '@/app/components/ProjectStats';

function isUUID(str: string) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(str);
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient();

    // 1. Fetch Project (by ID or Slug)
    let query = supabase.from('projects').select('*, profiles(*)')

    if (isUUID(id)) {
        query = query.eq('id', id);
    } else {
        query = query.eq('slug', id);
    }

    const { data: project } = await query.single();

    if (!project) return notFound();

    // Auth (Better Auth)
    const session = await auth.api.getSession({
        headers: await headers()
    });
    const user = session?.user; // Variable is 'user'

    // Fetch user role for admin override
    let userProfile = null;
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
        userProfile = profile;
    }

    const isOwner = user?.id === project.user_id;
    const canEdit = isOwner || (userProfile?.role === 'ADMIN' || userProfile?.role === 'CEO');

    // 3. Fetch Social Data (Comments, Gifts, Likes, Saves, Shares)
    // 3. Fetch Social Data (Comments, Gifts, Likes, Saves, Shares)
    // Comments
    const { data: rawComments } = await supabase
        .from('project_comments')
        .select('*')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false });

    // Manual join for profiles (Better Auth 'user' table)
    const commentIds = rawComments?.map(c => c.id) || [];
    const userIds = [...new Set(rawComments?.map(c => c.user_id) || [])];

    // Parallel fetch: Users and COMMENT LIKES
    const [usersRes, likesRes] = await Promise.all([
        supabase.from('user').select('id, name, image').in('id', userIds),
        supabase.from('comment_likes').select('*').in('comment_id', commentIds)
    ]);

    const commentUsers = usersRes.data;
    const allCommentLikes = likesRes.data || [];

    const comments = rawComments?.map(c => {
        const commentAuthor = commentUsers?.find(u => u.id === c.user_id);
        const likesForComment = allCommentLikes.filter(l => l.comment_id === c.id);
        const isLiked = user ? likesForComment.some(l => l.user_id === user.id) : false;

        return {
            ...c,
            profiles: commentAuthor ? {
                name: commentAuthor.name,
                avatar_url: commentAuthor.image
            } : null,
            likes: likesForComment.length,
            isLiked: isLiked
        };
    }) || [];

    // Gifts
    const { data: gifts } = await supabase
        .from('gift_types')
        .select('*')
        .order('price', { ascending: true });

    // Likes
    const { count: likeCount } = await supabase
        .from('project_likes')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', project.id);

    // Saves
    const { count: saveCount } = await supabase
        .from('project_saves')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', project.id);

    // Shares
    const { count: shareCount } = await supabase
        .from('project_shares')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', project.id);

    // User interactions status
    let isLiked = false;
    let isSaved = false;

    if (user) {
        const { data: likeData } = await supabase
            .from('project_likes')
            .select('user_id')
            .eq('project_id', project.id)
            .eq('user_id', user.id)
            .single();
        if (likeData) isLiked = true;

        const { data: saveData } = await supabase
            .from('project_saves')
            .select('user_id')
            .eq('project_id', project.id)
            .eq('user_id', user.id)
            .single();
        if (saveData) isSaved = true;
    }

    // Determine Display Image (Cover or First Gallery or Null)
    const displayImage = project.cover_image || (project.gallery_images && project.gallery_images.length > 0 ? project.gallery_images[0] : null);

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-12"> {/* Removed py-12, kept pb-12 */}

            {/* Hero / Cover */}
            <div className="relative h-[60vh] w-full bg-black overflow-hidden"> {/* Increased height for drama */}
                {displayImage ? (
                    <Image
                        src={displayImage}
                        alt={project.title}
                        fill
                        className="object-cover opacity-80"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-[#111] flex items-center justify-center">
                        <Camera className="w-20 h-20 text-white/10" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div> {/* Improved gradient */}

                <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" /> {/* Header legibility gradient */}

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20">
                    <div className="container mx-auto relative flex flex-col">

                        {/* Header Actions Row - Left Aligned Group */}
                        <div className="flex items-center gap-3 mb-4">
                            <Link href="/profile" className="inline-flex items-center gap-2 text-white/80 hover:text-[#FF9800] text-sm uppercase tracking-widest transition-colors font-bold backdrop-blur-sm bg-black/30 px-3 py-1 rounded-full border border-white/10 hover:bg-black/50">
                                <ArrowLeft className="w-4 h-4" /> Volver
                            </Link>

                            {/* Owner Actions Menu (Three Dots) - Grouped with Back button */}
                            {canEdit && (
                                <div className="z-50">
                                    <ProjectContextMenu projectId={project.id} isArchived={project.archived} />
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-7xl font-oswald font-bold uppercase leading-none drop-shadow-2xl mb-2">
                            {project.title}
                        </h1>

                        {/* Rating (Netflix Style) */}
                        <div className="flex items-center gap-3 mb-6">
                            {(() => {
                                const validRatings = rawComments?.filter(c => c.rating > 0) || [];
                                const avg = validRatings.length > 0
                                    ? validRatings.reduce((acc, c) => acc + c.rating, 0) / validRatings.length
                                    : 0;

                                return (
                                    <>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-5 h-5 ${star <= Math.round(avg) ? 'fill-[#FF9800] text-[#FF9800]' : 'text-white/30'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[#FF9800] font-bold text-lg">{avg > 0 ? avg.toFixed(1) : 'Original'}</span>
                                        <span className="text-white/50 text-sm font-bold">
                                            {avg > 0 ? `(${validRatings.length} opiniones)` : '(Sin calificaciones)'}
                                        </span>
                                    </>
                                );
                            })()}
                        </div>

                        {/* Stats Row (Netflix Style) */}
                        <div className="flex flex-wrap items-center gap-6 mb-6">
                            <ProjectStats
                                projectId={project.id}
                                likeCount={likeCount || 0}
                                saveCount={saveCount || 0}
                                shareCount={shareCount || 0}
                                commentCount={comments?.length || 0}
                                isLiked={isLiked}
                                isSaved={isSaved}
                                user={user}
                            />
                        </div>

                        {/* Metadata Tags */}
                        <div className="flex flex-wrap items-center gap-4 text-[#FF9800] font-bold uppercase tracking-wider text-sm md:text-base drop-shadow-md">
                            <span>{project.make}</span>
                            <span>•</span>
                            <span>{project.model}</span>
                            <span>•</span>
                            <span>{project.year}</span>
                            {project.location && (
                                <>
                                    <span>•</span>
                                    <span className="text-white/80">{project.location}</span>
                                </>
                            )}
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
                        <p className="text-white/80 leading-relaxed text-lg whitespace-pre-line font-light">
                            {project.description || "El dueño aún no ha contado la historia de este proyecto."}
                        </p>
                    </section>

                    {/* Gallery Section */}
                    <ProjectGallery
                        projectId={project.id}
                        images={project.gallery_images || []}
                        isOwner={canEdit}
                    />

                    {/* Social Section (Gifts, Comments) */}
                    <div id="comments-section" className="pt-12 border-t border-white/5">
                        <ProjectSocial
                            projectId={project.id}
                            comments={comments || []}
                            gifts={gifts || []}
                            user={user}
                        />
                    </div>

                </div>

                {/* Sidebar: Specs & Owner */}
                <div className="space-y-8">

                    {/* Owner Card */}
                    <div className="bg-[#111] border border-[#222] p-6 rounded-2xl sticky top-24">
                        <div className="flex items-center gap-4 mb-6 border-b border-[#222] pb-6">
                            <div className="w-16 h-16 rounded-full bg-[#222] overflow-hidden border-2 border-[#FF9800]">
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

                        {/* Actions */}
                        {isOwner ? (
                            <div className="grid grid-cols-1 gap-3">
                                <Link
                                    href={`/projects/${project.id}/edit`}
                                    className="bg-[#222] hover:bg-[#333] text-white py-3 rounded-xl font-bold uppercase text-xs flex items-center justify-center gap-2 transition-colors border border-white/5"
                                >
                                    <Edit2 className="w-4 h-4" /> Editar Proyecto
                                </Link>
                            </div>
                        ) : (
                            <button className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-black py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(255,152,0,0.2)]">
                                <Share2 className="w-4 h-4" /> Compartir Proyecto
                            </button>
                        )}
                    </div>

                    {/* Specs List */}
                    {project.specs && Object.values(project.specs).some(val => val) ? (
                        <div className="bg-[#111] border border-[#222] p-6 rounded-2xl">
                            <h3 className="text-white/40 uppercase text-xs font-bold tracking-widest mb-6 border-b border-[#222] pb-4">Ficha Técnica</h3>
                            <div className="space-y-3">
                                {project.specs.engine && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/50">Motor</span>
                                        <span className="font-bold text-white uppercase">{project.specs.engine}</span>
                                    </div>
                                )}
                                {project.specs.horsepower && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/50">Potencia</span>
                                        <span className="font-bold text-[#FF9800] uppercase">{project.specs.horsepower}</span>
                                    </div>
                                )}
                                {project.specs.torque && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/50">Torque</span>
                                        <span className="font-bold text-white uppercase">{project.specs.torque}</span>
                                    </div>
                                )}
                                {project.specs.drivetrain && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/50">Tracción</span>
                                        <span className="font-bold text-white uppercase">{project.specs.drivetrain}</span>
                                    </div>
                                )}
                                {project.specs.transmission && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/50">Transmisión</span>
                                        <span className="font-bold text-white uppercase">{project.specs.transmission}</span>
                                    </div>
                                )}
                                {project.specs.suspension && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/50">Suspensión</span>
                                        <span className="font-bold text-white uppercase">{project.specs.suspension}</span>
                                    </div>
                                )}
                                {project.specs.performance_0_100 && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/50">0 - 100 km/h</span>
                                        <span className="font-bold text-white uppercase">{project.specs.performance_0_100}</span>
                                    </div>
                                )}
                                {project.specs.quarter_mile && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/50">1/4 de Milla</span>
                                        <span className="font-bold text-white uppercase">{project.specs.quarter_mile}</span>
                                    </div>
                                )}
                                {project.specs.tocancipa_time && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/50">Tiempo Tocancipá</span>
                                        <span className="font-bold text-white uppercase">{project.specs.tocancipa_time}</span>
                                    </div>
                                )}
                                {project.specs.top_speed && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/50">Vel. Máxima</span>
                                        <span className="font-bold text-white uppercase">{project.specs.top_speed}</span>
                                    </div>
                                )}
                                {project.specs.weight && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/50">Peso</span>
                                        <span className="font-bold text-white uppercase">{project.specs.weight}</span>
                                    </div>
                                )}
                                {project.specs.color && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/50">Color</span>
                                        <span className="font-bold text-white uppercase">{project.specs.color}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Default placeholder if no specs yet */
                        <div className="bg-[#111] border border-[#222] p-6 rounded-2xl opacity-50">
                            <h3 className="text-white/40 uppercase text-xs font-bold tracking-widest mb-4">Especificaciones</h3>
                            <p className="text-xs text-white/30 italic">Sin datos técnicos registrados.</p>
                        </div>
                    )}

                </div>
            </div>
        </div >
    );
}
