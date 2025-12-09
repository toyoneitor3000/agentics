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
}

export const CourseCard = ({ course }: { course: CourseProps }) => {
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
                        {course.price === 0 ? 'GRATIS' : `$${course.price} USD`}
                    </div>
                    <Link href={`/academy/course/${course.id}`} style={{ width: '100%' }}>
                        <Button size="sm" fullWidth>Ver Curso</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
