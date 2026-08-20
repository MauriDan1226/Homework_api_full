// Marca de la aplicacion. Es un SVG y no una imagen para que herede el tamano
// del contexto y se mantenga nitida en cualquier pantalla.
function BrandMark({ size = 30 }) {
  return (
    <svg
      className="brand-mark"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label="Tareas"
      focusable="false"
    >
      <defs>
        <linearGradient id="brand-mark-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c5cff" />
          <stop offset="52%" stopColor="#c44fe8" />
          <stop offset="100%" stopColor="#f5a65b" />
        </linearGradient>
        <linearGradient id="brand-mark-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="32" height="32" rx="10" fill="url(#brand-mark-fill)" />
      <rect width="32" height="32" rx="10" fill="url(#brand-mark-sheen)" />
      <path
        d="M9.5 16.6l4.3 4.3 8.7-9.2"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default BrandMark;
