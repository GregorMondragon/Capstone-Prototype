import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getDiseaseById } from '../data/diseaseData';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { getScanAnalytics } from '../services/api';
import './DashboardPage.css';

/**
 * Dashboard Page — analytics overview of all scan data.
 * Shows total scans, disease distribution, severity breakdown,
 * and recent activity with visual charts.
 */
export default function DashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { error: showError } = useToast();

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getScanAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      showError('Could not load analytics data.');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  if (loading) {
    return (
      <div className="dashboard-page">
        <LoadingSpinner text="Loading analytics..." />
      </div>
    );
  }

  const {
    total_scans = 0,
    healthy_count = 0,
    diseased_count = 0,
    disease_distribution = {},
    recent_scans = [],
    health_score = 100,
  } = analytics || {};

  // Prepare distribution data sorted by count
  const distributionEntries = Object.entries(disease_distribution)
    .map(([classId, count]) => ({
      classId,
      count,
      disease: getDiseaseById(classId),
    }))
    .sort((a, b) => b.count - a.count);

  const maxDistCount = Math.max(...distributionEntries.map((e) => e.count), 1);

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <div className="dashboard-page__header animate-fade-in-up">
        <div className="section-header">
          <span className="section-eyebrow">Analytics</span>
          <h1 className="section-title">Dashboard</h1>
          <p className="section-subtitle">
            Overview of your scanning activity and disease detection patterns.
          </p>
        </div>
      </div>

      {total_scans === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">📊</span>
          <h3 className="empty-state-title">No data yet</h3>
          <p className="empty-state-text">
            Start scanning banana leaves to see analytics and insights here.
          </p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
            Start Scanning
          </Link>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="dashboard-page__stat-row stagger-children">
            <div className="dashboard-page__stat-card">
              <div className="dashboard-page__stat-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
                  <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </div>
              <span className="dashboard-page__stat-val">{total_scans}</span>
              <span className="dashboard-page__stat-lbl">Total Scans</span>
            </div>

            <div className="dashboard-page__stat-card">
              <div className="dashboard-page__stat-icon-wrap dashboard-page__stat-icon-wrap--healthy">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-healthy)" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <span className="dashboard-page__stat-val" style={{ color: 'var(--color-healthy)' }}>{healthy_count}</span>
              <span className="dashboard-page__stat-lbl">Healthy</span>
            </div>

            <div className="dashboard-page__stat-card">
              <div className="dashboard-page__stat-icon-wrap dashboard-page__stat-icon-wrap--danger">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <span className="dashboard-page__stat-val" style={{ color: 'var(--color-danger)' }}>{diseased_count}</span>
              <span className="dashboard-page__stat-lbl">Diseased</span>
            </div>

            <div className="dashboard-page__stat-card">
              <div className="dashboard-page__stat-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="dashboard-page__stat-val">{health_score}%</span>
              <span className="dashboard-page__stat-lbl">Health Score</span>
            </div>
          </div>

          {/* Disease Distribution */}
          <div className="dashboard-page__section card animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h3 className="dashboard-page__section-title">Disease Distribution</h3>
            <div className="dashboard-page__distribution">
              {distributionEntries.map((entry) => (
                <div key={entry.classId} className="dashboard-page__dist-row">
                  <div className="dashboard-page__dist-label">
                    <span className="dashboard-page__dist-icon">{entry.disease?.icon || '•'}</span>
                    <span className="dashboard-page__dist-name">{entry.disease?.name || entry.classId}</span>
                  </div>
                  <div className="dashboard-page__dist-bar-track">
                    <div
                      className="dashboard-page__dist-bar-fill"
                      style={{
                        width: `${(entry.count / maxDistCount) * 100}%`,
                        backgroundColor: entry.disease?.color || 'var(--color-primary)',
                      }}
                    />
                  </div>
                  <span className="dashboard-page__dist-count">{entry.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-page__section card animate-fade-in-up" style={{ animationDelay: '280ms' }}>
            <div className="dashboard-page__section-header">
              <h3 className="dashboard-page__section-title">Recent Activity</h3>
              <Link to="/history" className="btn btn-ghost btn-sm">
                View All
              </Link>
            </div>
            <div className="dashboard-page__recent-list">
              {recent_scans.slice(0, 8).map((scan, index) => {
                const disease = getDiseaseById(scan.top_prediction);
                const pct = (scan.confidence * 100).toFixed(1);
                return (
                  <div key={index} className="dashboard-page__recent-item">
                    <span className="dashboard-page__recent-icon">{disease?.icon || '🍃'}</span>
                    <div className="dashboard-page__recent-info">
                      <span className="dashboard-page__recent-name">{disease?.name || scan.top_prediction}</span>
                      <span className="dashboard-page__recent-time">
                        {new Date(scan.scanned_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <span
                      className="dashboard-page__recent-pct"
                      style={{ color: disease?.color }}
                    >
                      {pct}%
                    </span>
                  </div>
                );
              })}

              {recent_scans.length === 0 && (
                <p className="dashboard-page__no-recent">No recent scans.</p>
              )}
            </div>
          </div>

          {/* Quick Action */}
          <div className="dashboard-page__cta animate-fade-in-up" style={{ animationDelay: '340ms' }}>
            <Link to="/" className="btn btn-primary btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
                <circle cx="12" cy="12" r="4" />
              </svg>
              New Scan
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
