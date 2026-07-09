import { useState } from 'react';
import SeverityBadge from '../ui/SeverityBadge';
import { typeConfig } from '../../data/diseaseData';
import './DiseaseCard.css';

/**
 * Expandable disease information card for the Library page.
 * Shows overview, symptoms, treatment, and prevention in tabbed sections.
 */
export default function DiseaseCard({ disease, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [activeTab, setActiveTab] = useState('overview');

  if (!disease) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'symptoms', label: 'Symptoms' },
    { id: 'treatment', label: 'Treatment' },
    { id: 'prevention', label: 'Prevention' },
  ];

  return (
    <div
      className={`disease-card card ${expanded ? 'disease-card--expanded' : ''}`}
      style={{ '--card-accent': disease.color }}
    >
      {/* Header — Always visible */}
      <button
        className="disease-card__header"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        <div className="disease-card__header-left">
          <span className="disease-card__icon">{disease.icon}</span>
          <div className="disease-card__header-text">
            <h3 className="disease-card__name">{disease.name}</h3>
            {disease.scientificName && (
              <span className="disease-card__scientific">
                {disease.scientificName}
              </span>
            )}
          </div>
        </div>
        <div className="disease-card__header-right">
          <SeverityBadge severity={disease.severity} size="sm" />
          {disease.type !== 'Normal' && (
            <span
              className={`badge ${typeConfig[disease.type]?.badgeClass || 'badge-info'}`}
            >
              {disease.type}
            </span>
          )}
          <svg
            className={`disease-card__chevron ${expanded ? 'disease-card__chevron--open' : ''}`}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Short description — Always visible */}
      <p className="disease-card__short-desc">{disease.shortDescription}</p>

      {/* Expanded Content */}
      {expanded && (
        <div className="disease-card__body animate-fade-in">
          {/* Tabs */}
          <div className="disease-card__tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`disease-card__tab ${activeTab === tab.id ? 'disease-card__tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="disease-card__tab-content">
            {activeTab === 'overview' && (
              <div className="disease-card__section">
                <p className="disease-card__desc">{disease.description}</p>
                <div className="disease-card__meta-grid">
                  <div className="disease-card__meta-item">
                    <span className="disease-card__meta-label">Spread Rate</span>
                    <span className="disease-card__meta-value">{disease.spreadRate}</span>
                  </div>
                  <div className="disease-card__meta-item">
                    <span className="disease-card__meta-label">Affected Parts</span>
                    <span className="disease-card__meta-value">
                      {disease.affectedParts?.join(', ') || 'N/A'}
                    </span>
                  </div>
                  <div className="disease-card__meta-item">
                    <span className="disease-card__meta-label">Common Regions</span>
                    <span className="disease-card__meta-value">{disease.commonRegions}</span>
                  </div>
                  <div className="disease-card__meta-item">
                    <span className="disease-card__meta-label">Cause</span>
                    <span className="disease-card__meta-value">{disease.causes}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'symptoms' && (
              <div className="disease-card__section">
                <ul className="disease-card__list">
                  {disease.symptoms?.map((symptom, i) => (
                    <li key={i} className="disease-card__list-item">
                      <span className="disease-card__list-bullet" style={{ backgroundColor: disease.color }} />
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'treatment' && (
              <div className="disease-card__section disease-card__treatment">
                {disease.treatment?.chemical?.length > 0 && (
                  <div className="disease-card__treatment-group">
                    <h5 className="disease-card__treatment-heading">
                      <span className="disease-card__treatment-icon">🧪</span>
                      Chemical Treatment
                    </h5>
                    <ul className="disease-card__list">
                      {disease.treatment.chemical.map((item, i) => (
                        <li key={i} className="disease-card__list-item">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {disease.treatment?.biological?.length > 0 && (
                  <div className="disease-card__treatment-group">
                    <h5 className="disease-card__treatment-heading">
                      <span className="disease-card__treatment-icon">🦠</span>
                      Biological Control
                    </h5>
                    <ul className="disease-card__list">
                      {disease.treatment.biological.map((item, i) => (
                        <li key={i} className="disease-card__list-item">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {disease.treatment?.cultural?.length > 0 && (
                  <div className="disease-card__treatment-group">
                    <h5 className="disease-card__treatment-heading">
                      <span className="disease-card__treatment-icon">🌱</span>
                      Cultural Practices
                    </h5>
                    <ul className="disease-card__list">
                      {disease.treatment.cultural.map((item, i) => (
                        <li key={i} className="disease-card__list-item">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'prevention' && (
              <div className="disease-card__section">
                <ul className="disease-card__list disease-card__list--prevention">
                  {disease.prevention?.map((item, i) => (
                    <li key={i} className="disease-card__list-item">
                      <span className="disease-card__list-check">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* References */}
          {disease.references?.length > 0 && (
            <div className="disease-card__references">
              <span className="disease-card__references-label">References:</span>
              {disease.references.map((ref, i) => (
                <span key={i} className="disease-card__reference">{ref}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
