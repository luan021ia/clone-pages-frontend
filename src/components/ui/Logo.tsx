import React from 'react';

interface LogoProps {
  src?: string;
  alt?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  src,
  alt = 'Logo',
  className = ''
}) => {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`logo-img ${className}`}
      />
    );
  }

  return (
    <div className={`logo ${className}`}>
      Clone Pages
    </div>
  );
};