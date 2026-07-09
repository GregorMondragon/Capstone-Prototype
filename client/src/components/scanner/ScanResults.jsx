import { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfidenceGauge from '../ui/ConfidenceGauge';
import SeverityBadge from '../ui/SeverityBadge';
import { getDiseaseById, typeConfig } from '../../data/diseaseData';
import './ScanResults.css';

/**
 * Displays scan prediction results with confidence gauge,
 * prediction bars, and quick action links.
 */
export default function ScanResults({ results, imageUrl }) {
  const [expanded, setExpanded] = useState(false);

  if (!results || !results.predictions || results.predictions.length === 0) {
    return null;
  }

  const topPrediction = results.predictions[0];
  const disease = getDiseaseById(topPrediction.class_id);
  const confidence = (topPrediction.confidence * 100).toFixed(1);
  const isHealthy = topPrediction.class_id === 'healthy';
  const topN = expanded ? results.predictions : results.predictions.slice(0, 3);

  return (
    <div className="scan-results animate-fade-in-up">
      {/* Primary Result Card */}
      <div className="scan-results__primary card">
        <div className="scan-results__primary-inner">
          {/* Image Thumbnail */}
          {imageUrl && (
            <div className="scan-results__image-col">
              <img
                src={imageUrl}
                alt="Scanned leaf"
                className="scan-results__thumbnail"
              />
            </div>
          )}

          {/* Gauge Column */}
          <div className="scan-results__gauge-col">
            <ConfidenceGauge
              percentage={parseFloat(confidence)}
              size={140}
              strokeWidth={9}
              color={disease?.color}
              label="Confidence"
            />
          </div>

          {/* Info Column */}
          <div className="scan-results__info-col">
            <div className="scan-results__disease-header">
              <span className="scan-results__disease-icon">{disease?.icon}</span>
              <div>
                <h3 className="scan-results__disease-name">{disease?.name || topPrediction.class_id}</h3>
                {disease?.scientificName && (
                  <span className="scan-results__scientific-name">
                    {disease.scientificName}
                  </span>
                )}
              </div>
            </div>

            <div className="scan-results__badges">
              <SeverityBadge severity={disease?.severity || 'moderate'} />
              {disease?.type && disease.type !== 'Normal' && (
                <span className={`badge ${typeConfig[disease.type]?.badgeClass || 'badge-info'}`}>
                  {disease.type}
                </span>
              )}
            </div>

            <p className="scan-results__description">
              {disease?.shortDescription}
            </p>

            <div className="scan-results__actions">
              {!isHealthy && (
                <Link
                  to={`/library?disease=${topPrediction.class_id}`}
                  className="btn btn-primary btn-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                  </svg>
                  View Treatment
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Breakdown */}
      <div className="scan-results__breakdown card">
        <div className="scan-results__breakdown-header">
          <h4 className="scan-results__breakdown-title">Prediction Breakdown</h4>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? 'Show Less' : 'Show All'}
          </button>
        </div>
        <div className="scan-results__bars stagger-children">
          {topN.map((pred, index) => {
            const d = getDiseaseById(pred.class_id);
            const pct = (pred.confidence * 100).toFixed(1);
            return (
              <div
                key={pred.class_id}
                className={`scan-results__bar-row ${index === 0 ? 'scan-results__bar-row--top' : ''}`}
              >
                <div className="scan-results__bar-label">
                  <span className="scan-results__bar-icon">{d?.icon || '•'}</span>
                  <span className="scan-results__bar-name">{d?.name || pred.class_id}</span>
                </div>
                <div className="scan-results__bar-track">
                  <div
                    className="scan-results__bar-fill"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: d?.color || 'var(--color-primary)',
                      animationDelay: `${index * 100}ms`,
                    }}
                  />
                </div>
                <span
                  className="scan-results__bar-value"
                  style={{ color: d?.color || 'var(--color-text-secondary)' }}
                >
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Batch results summary view for multiple scanned images.
 */
export function BatchScanResults({ batchResults }) {
  if (!batchResults || batchResults.length === 0) return null;

  const healthyCount = batchResults.filter(
    (r) => r.predictions?.[0]?.class_id === 'healthy'
  ).length;
  const diseasedCount = batchResults.length - healthyCount;

  return (
    <div className="batch-results animate-fade-in-up">
      {/* Summary */}
      <div className="batch-results__summary card">
        <h3 className="batch-results__summary-title">Batch Scan Summary</h3>
        <div className="batch-results__stats">
          <div className="batch-results__stat">
            <span className="batch-results__stat-value">{batchResults.length}</span>
            <span className="batch-results__stat-label">Total Scanned</span>
          </div>
          <div className="batch-results__stat batch-results__stat--healthy">
            <span className="batch-results__stat-value">{healthyCount}</span>
            <span className="batch-results__stat-label">Healthy</span>
          </div>
          <div className="batch-results__stat batch-results__stat--diseased">
            <span className="batch-results__stat-value">{diseasedCount}</span>
            <span className="batch-results__stat-label">Diseased</span>
          </div>
        </div>
      </div>

      {/* Individual Results */}
      <div className="batch-results__grid">
        {batchResults.map((result, index) => {
          const top = result.predictions?.[0];
          const disease = top ? getDiseaseById(top.class_id) : null;
          const pct = top ? (top.confidence * 100).toFixed(1) : 0;

          return (
            <div
              key={index}
              className="batch-results__item card"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {result.image_url && (
                <img
                  src={result.image_url}
                  alt={result.filename}
                  className="batch-results__item-image"
                />
              )}
              <div className="batch-results__item-info">
                <div className="batch-results__item-header">
                  <span className="batch-results__item-icon">{disease?.icon}</span>
                  <span className="batch-results__item-name">{disease?.name}</span>
                </div>
                <div className="batch-results__item-meta">
                  <SeverityBadge severity={disease?.severity || 'moderate'} size="sm" />
                  <span
                    className="batch-results__item-confidence"
                    style={{ color: disease?.color }}
                  >
                    {pct}%
                  </span>
                </div>
                <span className="batch-results__item-filename">{result.filename}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
