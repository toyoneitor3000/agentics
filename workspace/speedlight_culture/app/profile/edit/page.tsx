'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Camera, Save, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        full_name: '',
        alias: '',
        bio: '',
        location: '',
        avatar_url: '',
        cover_url: '',
        show_location: true,
        show_join_date: true
    });
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUser(user);

            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, alias, bio, location, avatar_url, cover_url, show_location, show_join_date')
                .eq('id', user.id)
                .single();

            if (profile) {
                setFormData({
                    full_name: profile.full_name || '',
                    alias: profile.alias || '',
                    bio: profile.bio || '',
                    location: profile.location || '',
                    avatar_url: profile.avatar_url || '',
                    cover_url: profile.cover_url || '',
                    show_location: profile.show_location !== false,
                    show_join_date: profile.show_join_date !== false
                });
            }
            setLoading(false);
        };
        getProfile();
    }, [router, supabase]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar_url' | 'cover_url') => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        setSaving(true);
        try {
            // Upload to Supabase Storage (assuming 'avatars' bucket for profile stuff)
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, [field]: publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error al subir la imagen');
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    alias: formData.alias,
                    bio: formData.bio,
                    location: formData.location,
                    avatar_url: formData.avatar_url,
                    cover_url: formData.cover_url,
                    show_location: formData.show_location,
                    show_join_date: formData.show_join_date,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id);

            if (error) throw error;
            router.refresh();
            router.push('/profile');
        } catch (error: any) {
            console.error('Error updating profile:', error.message || error);
            alert(`Error al actualizar el perfil: ${error.message || 'Intenta nuevamente'}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#FF9800] animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <div className="max-w-xl mx-auto pb-20">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-[#222] px-4 py-4 flex items-center justify-between">
                    <Link href="/profile" className="p-2 -ml-2 text-white/60 hover:text-white">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-lg font-bold font-oswald uppercase">Editar Perfil</h1>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="text-[#FF9800] font-bold text-sm disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-6 h-6" />}
                    </button>
                </header>

                <div className="p-4 space-y-8">
                    {/* Cover Image Edit */}
                    <div className="relative h-40 w-full rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#333] group">
                        {formData.cover_url ? (
                            <Image src={formData.cover_url} alt="Cover" fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-white/20 font-bold uppercase tracking-widest">
                                PORTADA
                            </div>
                        )}
                        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-8 h-8 text-white mb-2" />
                            <span className="text-xs font-bold uppercase tracking-wider bg-black/50 px-3 py-1 rounded-full">Cambiar Portada</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'cover_url')} />
                        </label>
                    </div>

                    {/* Avatar Edit - Overlapping slightly up */}
                    <div className="flex justify-center -mt-16 relative z-10">
                        <div className="relative w-32 h-32 rounded-full border-4 border-[#050505] bg-[#1a1a1a] overflow-hidden group">
                            {formData.avatar_url ? (
                                <Image src={formData.avatar_url} alt="Avatar" fill className="object-cover opacity-80 group-hover:opacity-50 transition-opacity" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white/20">U</div>
                            )}
                            <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                <Camera className="w-8 h-8 text-white" />
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'avatar_url')} />
                            </label>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-[#FF9800] tracking-wider block">Nombre a Mostrar</label>
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#FF9800] focus:outline-none transition-colors"
                                placeholder="Tu nombre público"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-[#FF9800] tracking-wider block">Alias / Apodo</label>
                            <input
                                type="text"
                                value={formData.alias}
                                onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                                className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#FF9800] focus:outline-none transition-colors"
                                placeholder="@speedster"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-[#FF9800] tracking-wider block">Ubicación</label>
                            <input
                                list="cities"
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#FF9800] focus:outline-none transition-colors"
                                placeholder="Selecciona o escribe tu ciudad (Ej: Tokio, Japón)"
                            />
                            <datalist id="cities">
                                <option value="Bogotá, Colombia" />
                                <option value="Medellín, Colombia" />
                                <option value="Cali, Colombia" />
                                <option value="Barranquilla, Colombia" />
                                <option value="Cartagena, Colombia" />
                                <option value="Bucaramanga, Colombia" />
                                <option value="Pereira, Colombia" />
                                <option value="Manizales, Colombia" />
                                <option value="Santa Marta, Colombia" />
                                <option value="Cúcuta, Colombia" />
                                <option value="Ibagué, Colombia" />
                                <option value="Villavicencio, Colombia" />
                                <option value="Miami, USA" />
                                <option value="Ciudad de México, México" />
                                <option value="Madrid, España" />
                                <option value="Buenos Aires, Argentina" />
                                <option value="Santiago, Chile" />
                            </datalist>
                            <p className="text-[10px] text-white/40 mt-1 pl-1">
                                * Puedes escribir libremente cualquier ciudad y país si no está en la lista.
                            </p>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="flex items-center justify-between p-3 bg-[#111] border border-[#333] rounded-xl">
                                <span className="text-sm text-white">Mostrar Ubicación en perfil</span>
                                <input
                                    type="checkbox"
                                    checked={formData.show_location}
                                    onChange={(e) => setFormData({ ...formData, show_location: e.target.checked })}
                                    className="w-5 h-5 accent-[#FF9800]"
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-[#111] border border-[#333] rounded-xl">
                                <span className="text-sm text-white">Mostrar Fecha de Registro</span>
                                <input
                                    type="checkbox"
                                    checked={formData.show_join_date}
                                    onChange={(e) => setFormData({ ...formData, show_join_date: e.target.checked })}
                                    className="w-5 h-5 accent-[#FF9800]"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-[#FF9800] tracking-wider block">Descripción (Bio)</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#FF9800] focus:outline-none transition-colors min-h-[120px]"
                                placeholder="Cuéntanos sobre ti y tu pasión por los autos..."
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
