// Categorías disponibles del foro
// Este archivo NO usa "use server" para poder exportar constantes

export interface ForumCategory {
    id: string;
    name: string;
    color: string;
    description: string;
}

export const FORUM_CATEGORIES: ForumCategory[] = [
    { id: "general", name: "General", color: "#FF9800", description: "Conversaciones generales de la comunidad" },
    { id: "mecanica", name: "Mecánica", color: "#4CAF50", description: "Consejos técnicos, reparaciones y tutoriales" },
    { id: "proyectos", name: "Proyectos", color: "#2196F3", description: "Comparte tu build y sigue otros proyectos" },
    { id: "eventos", name: "Eventos", color: "#E91E63", description: "Meetups, competencias y encuentros" },
    { id: "marketplace", name: "Marketplace", color: "#9C27B0", description: "Compra, venta e intercambio de partes" },
    { id: "ayuda", name: "Ayuda", color: "#00BCD4", description: "Preguntas y respuestas de la comunidad" },
];
