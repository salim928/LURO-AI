import React from 'react';

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className = '' }) => (
  <p className={`card-description ${className}`}>{children}</p>
);

export default CardDescription;
