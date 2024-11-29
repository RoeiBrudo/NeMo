// src/components/base/Button/Button.jsx
import { forwardRef } from 'react';
import './Button.css';

const Button = forwardRef(({
  children,
  className = '',
  variant = 'primary', // primary, secondary, outline, ghost
  size = 'md', // sm, md, lg
  fullWidth = false,
  loading = false,
  disabled = false,
  icon = null,
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full' : '',
    loading ? 'btn-loading' : '',
    icon ? 'btn-with-icon' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading && (
        <span className="btn-spinner" aria-hidden="true">
          <svg className="spinner-icon" viewBox="0 0 24 24">
            <path d="M12,4 a8,8 0 0,1 8,8" />
          </svg>
        </span>
      )}
      {icon && !loading && (
        <span className="btn-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="btn-content">{children}</span>
    </button>
  );
});

Button.displayName = 'Button';

export default Button;