import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'interactive' | 'official-source';
  isOfficialSource?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  isOfficialSource = false,
  className = '',
  ...props
}) => {
  const isOfficial = isOfficialSource || variant === 'official-source';
  const isInteractive = variant === 'interactive';
  const cardClass = isOfficial ? 'official-source-card' : 'card';
  const interactiveClass = isInteractive ? 'card-interactive' : '';

  return (
    <div className={`${cardClass} ${interactiveClass} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`card-header ${className}`.trim()} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3 className={`card-title ${className}`.trim()} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <p className={`card-description ${className}`.trim()} style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 'var(--space-1)', marginBottom: 0 }} {...props}>
    {children}
  </p>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`card-body ${className}`.trim()} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`card-footer ${className}`.trim()} {...props}>
    {children}
  </div>
);
