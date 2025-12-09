import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    isLoading?: boolean;
}

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    className = '',
    ...props
}: ButtonProps) => {
    const buttonClass = `
    ${styles.button}
    ${styles[variant]}
    ${styles[size]}
    ${fullWidth ? styles.fullWidth : ''}
    ${isLoading ? styles.loading : ''}
    ${className}
  `.trim();

    return (
        <button className={buttonClass} disabled={isLoading || props.disabled} {...props}>
            {isLoading ? <span className={styles.spinner}></span> : children}
        </button>
    );
};
