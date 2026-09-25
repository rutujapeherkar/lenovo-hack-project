import React from 'react';

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: 'info' | 'warning' | 'error' | 'disclaimer';
  title?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  icon,
  children,
  className = '',
  ...props
}) => {
  const role = variant === 'error' ? 'alert' : variant === 'warning' ? 'alert' : 'status';

  return (
    <div className={`alert alert-${variant} ${className}`.trim()} role={role} {...props}>
      {icon && <div className="alert-icon" aria-hidden="true">{icon}</div>}
      <div className="alert-content">
        {title && <div className="alert-title" style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>}
        <div className="alert-message">{children}</div>
      </div>
    </div>
  );
};
