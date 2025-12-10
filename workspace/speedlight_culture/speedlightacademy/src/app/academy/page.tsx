import React from 'react';
import { CourseCard } from '@/components/academy/CourseCard';
import { CTABanner } from '@/components/ui/CTABanner';
import { AdFeedCard } from '@/components/AdBanners';
import styles from './academy.module.css';

import { createClient } from '@/app/utils/supabase/server';

const COURSES = [
    {
        id: '1',
        slug: 'foto-automotriz',
        title: 'Fotografía Automotriz: De la Calle al Estudio',
        instructor: 'Speedlight Team',
        level: 'Principiante' as const,
        rating: 4.9,
        students: 1240,
        price: 49,
        image: 'https://images.unsplash.com/photo-1550985543-f47f38aee65d?auto=format&fit=crop&q=80'
    },
    {
        id: '2',
        slug: 'retoque-photoshop',
        title: 'Retoque Digital High-End con Photoshop',
        instructor: 'Master Editor',
        level: 'Avanzado' as const,
        rating: 5.0,
        students: 856,
        price: 89,
        image: 'https://images.unsplash.com/photo-1626785774573-4b7993143eb6?auto=format&fit=crop&q=80'
    },
    {
        id: '3',
        slug: 'portafolio-web',
        title: 'Creación de Portafolios Web para Fotógrafos',
        instructor: 'Purrpurr.dev',
        level: 'Intermedio' as const,
        rating: 4.8,
        students: 210,
        price: 35,
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80'
    }
];

export default async function AcademyPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let enrolledCourses: string[] = [];

    if (user) {
        const { data } = await supabase
            .from('enrollments')
            .select('course_slug')
            .eq('user_id', user.id);

        if (data) {
            enrolledCourses = data.map(e => e.course_slug);
        }
    }

    return (
        <div className={styles.container}>
            <header className={styles.hero}>
                <h1 className={styles.title}>Speedlight Academy</h1>
                <p className={styles.subtitle}>
                    Formación especializada en artes visuales y tecnología para la industria automotriz.
                </p>
            </header>

            <div className={styles.grid}>
                {COURSES.map((course, index) => (
                    <React.Fragment key={course.id}>
                        <CourseCard
                            course={course}
                            isEnrolled={enrolledCourses.includes(course.slug)}
                        />
                        {/* Insert Ad after the second course */}
                        {index === 1 && (
                            <div className="center-flex w-full" style={{ display: 'flex', justifyContent: 'center' }}>
                                <AdFeedCard />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <CTABanner
                title="¿Eres un experto?"
                description="Si tienes conocimientos en fotografía, diseño o mecánica, únete a nuestra red de instructores y monetiza tu pasión."
                buttonText="Convertirse en Instructor"
                buttonLink="/academy/teach"
                backgroundImage="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80"
            />
        </div>
    );
}
