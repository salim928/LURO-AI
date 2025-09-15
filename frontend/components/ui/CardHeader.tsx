import React from 'react';

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`card-header ${className}`}>{children}</div>
);

export default CardHeader;
