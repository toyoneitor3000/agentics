import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from './CourseCard.module.css';

interface CourseProps {
    id: string;
    title: string;
    instructor: string;
    level: 'Principiante' | 'Intermedio' | 'Avanzado';
    rating: number;
    students: number;
    image: string;
    price: number;
    slug?: string;
}

export const CourseCard = ({ course, isEnrolled = false }: { course: CourseProps; isEnrolled?: boolean }) => {
    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <div className={styles.imagePlaceholder} style={{ backgroundImage: `url(${course.image})` }} />
                <span className={`${styles.level} ${styles[course.level.toLowerCase()]}`}>
                    {course.level}
                </span>
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{course.title}</h3>
                <p className={styles.instructor}>Instr. {course.instructor}</p>

                <div className={styles.stats}>
                    <span className={styles.rating}>★ {course.rating}</span>
                    <span className={styles.students}>{course.students} estudiantes</span>
                </div>

                <div className={styles.footer}>
                    <div className={styles.price}>
                        {isEnrolled ? (
                            <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>ADQUIRIDO</span>
                        ) : (
                            course.price === 0 ? 'GRATIS' : `$${course.price} USD`
                        )}
                    </div>
                    <Link href={`/academy/course/${course.id}`} style={{ width: '100%' }}>
                        <Button size="sm" fullWidth style={isEnrolled ? { backgroundColor: '#FF9800', color: 'black' } : {}}>
                            {isEnrolled ? 'Ver Clase' : 'Inscribirse'}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
