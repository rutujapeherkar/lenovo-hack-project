import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'mic';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  micState?: 'idle' | 'listening' | 'processing' | 'speaking' | 'unavailable';
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  micState = 'idle',
  children,
  className = '',
  disabled,
  ...props
}) => {
  if (variant === 'mic') {
    const listeningClass = micState === 'listening' ? 'listening' : '';
    const micIcon = micState === 'listening' ? '●' : micState === 'processing' ? '⏳' : '🎙';
    return (
      <button
        type="button"
        className={`btn-mic ${listeningClass} ${className}`.trim()}
        disabled={disabled || micState === 'unavailable'}
        aria-label={props['aria-label'] || `Voice input (${micState})`}
        {...props}
      >
        {children || micIcon}
      </button>
    );
  }

  const variantClass = `btn-${variant}`;
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const widthClass = fullWidth ? 'btn-full-width' : '';

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${widthClass} ${className}`.trim()}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="btn-icon" aria-hidden="true">{icon}</span>}
      {children && <span className="btn-label">{children}</span>}
      {icon && iconPosition === 'right' && <span className="btn-icon" aria-hidden="true">{icon}</span>}
    </button>
  );
};
