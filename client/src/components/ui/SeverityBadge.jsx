import { severityConfig } from '../../data/diseaseData';
import './SeverityBadge.css';

/**
 * Color-coded severity indicator badge.
 * Shows severity level with a pulsing dot for critical items.
 */
export default function SeverityBadge({ severity, size = 'md' }) {
  const config = severityConfig[severity] || severityConfig.moderate;

  return (
    <span
      className={`severity-badge severity-badge--${size} ${config.badgeClass}`}
      style={{
        '--badge-color': config.color,
        '--badge-bg': config.bgColor,
        '--badge-border': config.borderColor,
      }}
    >
      <span
        className={`severity-badge__dot ${severity === 'critical' ? 'severity-badge__dot--pulse' : ''}`}
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
}
