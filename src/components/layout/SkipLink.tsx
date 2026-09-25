import React from 'react';

export interface SkipLinkProps {
  targetId?: string;
  label?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId = 'main-content',
  label = 'Skip to main content / मुख्य सामग्रीवर जा',
}) => {
  const targetHref = targetId === 'main-content' ? '#main-content' : `#${targetId}`;
  return (
    <a href={targetHref} className="skip-link">
      {label}
    </a>
  );
};
