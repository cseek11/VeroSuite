import React from 'react';

interface SkipLinkProps {
  targetId?: string;
  children?: React.ReactNode;
}

const SkipLink: React.FC<SkipLinkProps> = ({ 
  targetId = 'main-content',
  children = 'Skip to main content'
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className="skip-link"
      tabIndex={0}
    >
      {children}
    </a>
  );
};

export default SkipLink;
