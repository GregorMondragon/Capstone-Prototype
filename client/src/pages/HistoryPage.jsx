import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SeverityBadge from '../components/ui/SeverityBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getDiseaseById } from '../data/diseaseData';
import { useToast } from '../context/ToastContext';
import { getScanHistory, deleteScanRecord, clearAllHistory } from '../services/api';
import './HistoryPage.css';

/**
 * History Page — displays persistent scan history from the database.
 * Supports filtering, deletion, and navigating to the disease library.
 */
export default function HistoryPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [confirmClear, setConfirmClear] = useState(false);
  const { success, error: showError } = useToast();

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getScanHistory(100);
      setRecords(data.records || []);
    } catch (err) {
      console.error('Failed to load history:', err);
      showError('Could not load scan history. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        await deleteScanRecord(id);
        setRecords((prev) => prev.filter((r) => r.id !== id));
        success('Record deleted.');
      } catch (err) {
        showError('Failed to delete record.');
      }
    },
    [success, showError]
  );

  const handleClearAll = useCallback(async () => {
    try {
      await clearAllHistory();
      setRecords([]);
      setConfirmClear(false);
      success('All scan history cleared.');
    } catch (err) {
      showError('Failed to clear history.');
    }
  }, [success, showError]);

  const filteredRecords = records.filter((record) => {
    if (filter === 'all') return true;
    if (filter === 'healthy') return record.top_prediction === 'healthy';
    if (filter === 'diseased') return record.top_prediction !== 'healthy';
    return true;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  // Summary stats
  const totalScans = records.length;
  const healthyCount = records.filter((r) => r.top_prediction === 'healthy').length;
  const diseasedCount = totalScans - healthyCount;

  return (
    <div className="history-page">
      {/* Page Header */}
      <div className="history-page__header animate-fade-in-up">
        <div className="section-header">
          <span className="section-eyebrow">Scan Records</span>
          <h1 className="section-title">Scan History</h1>
          <p className="section-subtitle">
            Review your past scans, track disease patterns, and monitor plant
            health over time.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading scan history..." />
      ) : (
        <>
          {/* Stats Summary */}
          {records.length > 0 && (
            <div className="history-page__stats animate-fade-in-up" style={{ animationDelay: '60ms' }}>
              <div className="history-page__stat-card">
                <span className="history-page__stat-value">{totalScans}</span>
                <span className="history-page__stat-label">Total Scans</span>
              </div>
              <div className="history-page__stat-card history-page__stat-card--healthy">
                <span className="history-page__stat-value">{healthyCount}</span>
                <span className="history-page__stat-label">Healthy</span>
              </div>
              <div className="history-page__stat-card history-page__stat-card--diseased">
                <span className="history-page__stat-value">{diseasedCount}</span>
                <span className="history-page__stat-label">Diseased</span>
              </div>
            </div>
          )}

          {/* Toolbar */}
          {records.length > 0 && (
            <div className="history-page__toolbar animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="history-page__filters">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'healthy', label: 'Healthy' },
                  { value: 'diseased', label: 'Diseased' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    className={`history-page__filter-btn ${filter === opt.value ? 'history-page__filter-btn--active' : ''}`}
                    onClick={() => setFilter(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {!confirmClear ? (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setConfirmClear(true)}
                >
                  Clear All
                </button>
              ) : (
                <div className="history-page__confirm-clear">
                  <span>Are you sure?</span>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleClearAll}
                  >
                    Yes, clear
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setConfirmClear(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Records List */}
          <div className="history-page__list stagger-children">
            {filteredRecords.map((record) => {
              const disease = getDiseaseById(record.top_prediction);
              const pct = (record.confidence * 100).toFixed(1);

              return (
                <div key={record.id} className="history-page__record card">
                  <div className="history-page__record-left">
                    <span className="history-page__record-icon">
                      {disease?.icon || '🍃'}
                    </span>
                    <div className="history-page__record-info">
                      <div className="history-page__record-top">
                        <span className="history-page__record-name">
                          {disease?.name || record.top_prediction}
                        </span>
                        <SeverityBadge
                          severity={disease?.severity || 'moderate'}
                          size="sm"
                        />
                      </div>
                      <div className="history-page__record-meta">
                        <span className="history-page__record-confidence" style={{ color: disease?.color }}>
                          {pct}% confidence
                        </span>
                        <span className="history-page__record-separator">·</span>
                        <span className="history-page__record-date">
                          {formatDate(record.scanned_at)}
                        </span>
                        {record.filename && (
                          <>
                            <span className="history-page__record-separator">·</span>
                            <span className="history-page__record-filename">
                              {record.filename}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="history-page__record-actions">
                    {record.top_prediction !== 'healthy' && (
                      <Link
                        to={`/library?disease=${record.top_prediction}`}
                        className="btn btn-ghost btn-sm"
                        title="View in library"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                        </svg>
                      </Link>
                    )}
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleDelete(record.id)}
                      title="Delete record"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredRecords.length === 0 && records.length > 0 && (
              <div className="empty-state">
                <span className="empty-state-icon">🔍</span>
                <h3 className="empty-state-title">No matching records</h3>
                <p className="empty-state-text">
                  No records match the current filter.
                </p>
              </div>
            )}

            {records.length === 0 && (
              <div className="empty-state">
                <span className="empty-state-icon">📋</span>
                <h3 className="empty-state-title">No scan history yet</h3>
                <p className="empty-state-text">
                  Your scan results will appear here after you analyze your first banana leaf.
                </p>
                <Link to="/" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
                  Start Scanning
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
