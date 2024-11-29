import './Loader.css';

const Loader = ({ size = 'medium', color = 'primary' }) => {
  return (
    <div className={`loader-container size-${size}`}>
      <div className={`loader color-${color}`} />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Size variants: small (24px), medium (40px), large (56px)
// Color variants: primary, secondary, light

export default Loader;
