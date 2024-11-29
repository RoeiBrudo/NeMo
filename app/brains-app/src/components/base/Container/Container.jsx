// src/components/base/Container/Container.jsx
import { forwardRef } from 'react';
import './Container.css';

const Container = forwardRef(({
  children,
  className = '',
  size = 'default', // sm, default, lg, xl, full
  padding = 'default', // none, sm, default, lg
  center = true,
  ...props
}, ref) => {
  const containerClasses = [
    'container',
    `container-${size}`,
    `container-padding-${padding}`,
    center ? 'container-center' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={containerClasses}
      {...props}
    >
      {children}
    </div>
  );
});

Container.displayName = 'Container';

export default Container;