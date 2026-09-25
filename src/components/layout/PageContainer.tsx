import React from 'react';

export interface PageContainerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  maxWidth,
  ...rest
}) => {
  const maxWidthStyle = maxWidth ? { maxWidth: maxWidth === 'full' ? '100%' : undefined } : {};

  return (
    <main
      id="main-content"
      role="main"
      className={`page-container ${className}`.trim()}
      style={maxWidthStyle}
      tabIndex={-1}
      {...rest}
    >
      {children}
    </main>
  );
};
