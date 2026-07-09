import { useState, useEffect } from 'react';
import './ConfidenceGauge.css';

/**
 * Animated SVG circular gauge showing confidence percentage.
 * Color transitions based on severity level.
 */
export default function ConfidenceGauge({
  percentage = 0,
  size = 160,
  strokeWidth = 10,
  color,
  label,
  animate = true,
}) {
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayPercentage / 100) * circumference;

  useEffect(() => {
    if (!animate) {
      setDisplayPercentage(percentage);
      return;
    }

    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      start = eased * percentage;
      setDisplayPercentage(start);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [percentage, animate]);

  const resolvedColor =
    color || (percentage >= 80 ? '#3da36e' : percentage >= 50 ? '#c8a84e' : '#c45c4a');

  return (
    <div className="confidence-gauge" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="confidence-gauge__svg"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(45, 65, 55, 0.3)"
          strokeWidth={strokeWidth}
        />
        {/* Filled arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={resolvedColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="confidence-gauge__ring"
          style={{
            '--ring-circumference': circumference,
            '--ring-offset': offset,
            filter: `drop-shadow(0 0 6px ${resolvedColor}40)`,
          }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="confidence-gauge__content">
        <span
          className="confidence-gauge__value"
          style={{ color: resolvedColor }}
        >
          {Math.round(displayPercentage)}
          <span className="confidence-gauge__percent">%</span>
        </span>
        {label && <span className="confidence-gauge__label">{label}</span>}
      </div>
    </div>
  );
}
