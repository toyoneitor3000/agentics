'use client';

import { useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { Upload, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const UploadGallery = ({ projectId }: { projectId: string }) => {
    const [isUploading, setIsUploading] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setIsUploading(true);
        const files = Array.from(e.target.files);
        const uploadedUrls: string[] = [];

        try {
            for (const file of files) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${projectId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('projects') // Make sure this bucket exists!
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('projects')
                    .getPublicUrl(fileName);

                uploadedUrls.push(publicUrl);
            }

            // First fetch current images and cover status
            const { data: currentProject } = await supabase
                .from('projects')
                .select('gallery_images, cover_image')
                .eq('id', projectId)
                .single();

            const currentImages = currentProject?.gallery_images || [];
            const newGallery = [...currentImages, ...uploadedUrls];

            // Prepare update payload
            const updates: any = { gallery_images: newGallery };

            // AUTO-SET COVER IMAGE logic
            // If no cover exists, use the first uploaded image
            if (!currentProject?.cover_image && uploadedUrls.length > 0) {
                updates.cover_image = uploadedUrls[0];
            }

            const { error: dbError } = await supabase
                .from('projects')
                .update(updates)
                .eq('id', projectId);

            if (dbError) throw dbError;

            router.refresh(); // Refresh page to see new images

        } catch (error: any) {
            alert('Error subiendo imágenes: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-[#1a1a1a] border border-[#333] border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors hover:border-[#FF9800]/50 hover:bg-[#1a1a1a]/80 group cursor-pointer relative">
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />

            {isUploading ? (
                <>
                    <Loader2 className="w-10 h-10 text-[#FF9800] animate-spin mb-4" />
                    <p className="text-[#FF9800] font-bold text-sm uppercase animate-pulse">Subiendo motor...</p>
                </>
            ) : (
                <>
                    <div className="w-16 h-16 bg-[#222] rounded-full flex items-center justify-center text-white/50 mb-4 group-hover:scale-110 group-hover:text-[#FF9800] transition-all">
                        <Upload className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Agregar Fotos a la Galería</h3>
                    <p className="text-white/40 text-sm max-w-sm">
                        Arrastra tus fotos aquí o haz clic para subir. <br />
                        <span className="text-xs text-white/20 mt-2 block">Soporta JPG, PNG hasta 5MB.</span>
                    </p>
                </>
            )}
        </div>
    );
};
