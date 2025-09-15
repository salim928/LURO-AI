import React from 'react';

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => (
  <h2 className={`card-title ${className}`}>{children}</h2>
);

export default CardTitle;
