import './LoadingSpinner.css';

/**
 * Leaf-themed loading spinner with optional status text.
 */
export default function LoadingSpinner({
  text = 'Analyzing...',
  size = 'md',
  showText = true,
  progress = null,
}) {
  return (
    <div className={`loading-spinner loading-spinner--${size}`}>
      <div className="loading-spinner__leaf-container">
        <div className="loading-spinner__leaf">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M24 4C24 4 8 12 8 28C8 36.837 15.163 44 24 44C32.837 44 40 36.837 40 28C40 12 24 4 24 4Z"
              fill="url(#leafGrad)"
              opacity="0.9"
            />
            <path
              d="M24 8V40M24 20C20 18 16 20 14 24M24 28C28 26 32 28 34 32"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="leafGrad" x1="24" y1="4" x2="24" y2="44">
                <stop offset="0%" stopColor="#4fba80" />
                <stop offset="100%" stopColor="#2d8a5a" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="loading-spinner__ring" />
      </div>
      {showText && (
        <div className="loading-spinner__text-block">
          <span className="loading-spinner__text">{text}</span>
          {progress !== null && (
            <div className="loading-spinner__progress-bar">
              <div
                className="loading-spinner__progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
