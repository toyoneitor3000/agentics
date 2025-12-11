import PageHero from '@/app/components/PageHero';


export default function ExplorePage() {
    return (
        <div className="min-h-screen bg-[#050302] pb-12">
            <PageHero
                title="Explorar"
                subtitle="Descubre el Ecosistema"
                description="Nuevos proyectos, talleres, eventos y lo mejor de la cultura automotriz en un solo lugar."
                image="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop"
                action={{
                    label: "Ver Tendencias",
                    href: "#trends"
                }}
            />

            <div className="container mx-auto px-6 mt-12 text-center text-[#BCAAA4]">
                <p>Próximamente: Motor de búsqueda avanzado y recomendaciones personalizadas.</p>
            </div>
        </div>
    );
}
