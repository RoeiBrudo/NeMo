// src/components/base/Card/Card.jsx
import { forwardRef } from 'react';
import './Card.css';

const Card = forwardRef(({
  children,
  className = '',
  variant = 'default',
  hoverable = false,
  padding = 'default', // 'none', 'small', 'default', 'large'
  elevation = 'default', // 'none', 'default', 'medium', 'high'
  border = true,
  onClick,
  ...props
}, ref) => {
  const cardClasses = [
    'card',
    `card-${variant}`,
    `card-padding-${padding}`,
    `card-elevation-${elevation}`,
    hoverable ? 'card-hoverable' : '',
    !border ? 'card-borderless' : '',
    onClick ? 'card-clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;