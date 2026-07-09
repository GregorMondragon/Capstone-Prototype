import { useState, useCallback } from 'react';
import ImageUploader from '../components/scanner/ImageUploader';
import CameraCapture from '../components/scanner/CameraCapture';
import ScanResults, { BatchScanResults } from '../components/scanner/ScanResults';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { scanSingleImage, scanBatchImages } from '../services/api';
import './ScannerPage.css';

/**
 * Scanner Page — primary page where users upload or capture
 * banana leaf images for disease detection.
 */
export default function ScannerPage() {
  const [mode, setMode] = useState('single'); // 'single' | 'batch'
  const [showCamera, setShowCamera] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [singleResult, setSingleResult] = useState(null);
  const [singleImageUrl, setSingleImageUrl] = useState(null);
  const [batchResults, setBatchResults] = useState(null);
  const { success, error: showError } = useToast();

  const handleImagesSelected = useCallback((files) => {
    setSelectedFiles(files);
    // Clear previous results when new images are selected
    setSingleResult(null);
    setBatchResults(null);
  }, []);

  const handleCameraCapture = useCallback(
    (file) => {
      setShowCamera(false);
      setSelectedFiles([file]);
      setSingleResult(null);
      setBatchResults(null);
      // Auto-scan after camera capture
      performScan([file]);
    },
    []
  );

  const performScan = useCallback(
    async (files = selectedFiles) => {
      if (files.length === 0) {
        showError('Please select at least one image to scan.');
        return;
      }

      setScanning(true);
      setScanProgress(0);
      setSingleResult(null);
      setBatchResults(null);

      try {
        if (mode === 'single' || files.length === 1) {
          setScanProgress(30);
          const result = await scanSingleImage(files[0]);
          setScanProgress(100);

          // Create preview URL for the scanned image
          const imageUrl = URL.createObjectURL(files[0]);
          setSingleImageUrl(imageUrl);
          setSingleResult(result);
          success('Scan complete — disease analysis ready.');
        } else {
          // Batch mode
          setScanProgress(20);
          const result = await scanBatchImages(files);
          setScanProgress(100);

          // Attach preview URLs to each result
          const resultsWithUrls = result.results.map((r, i) => ({
            ...r,
            image_url: files[i] ? URL.createObjectURL(files[i]) : null,
          }));

          setBatchResults(resultsWithUrls);
          success(`Batch scan complete — ${files.length} images analyzed.`);
        }
      } catch (err) {
        console.error('Scan error:', err);
        showError(
          err.message || 'Scan failed. Please check if the server is running.'
        );
      } finally {
        setScanning(false);
        setScanProgress(0);
      }
    },
    [selectedFiles, mode, success, showError]
  );

  const resetScan = useCallback(() => {
    setSelectedFiles([]);
    setSingleResult(null);
    setSingleImageUrl(null);
    setBatchResults(null);
    setScanning(false);
  }, []);

  return (
    <div className="scanner-page">
      {/* Page Header */}
      <div className="scanner-page__header animate-fade-in-up">
        <div className="section-header">
          <span className="section-eyebrow">AI-Powered Analysis</span>
          <h1 className="section-title">Scan Your Banana Leaf</h1>
          <p className="section-subtitle">
            Upload an image or use your camera to detect diseases with precision.
            Our CNN model analyzes leaf patterns and provides instant diagnosis.
          </p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="scanner-page__controls animate-fade-in-up" style={{ animationDelay: '80ms' }}>
        <div className="scanner-page__mode-toggle">
          <button
            className={`scanner-page__mode-btn ${mode === 'single' ? 'scanner-page__mode-btn--active' : ''}`}
            onClick={() => {
              setMode('single');
              resetScan();
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Single Scan
          </button>
          <button
            className={`scanner-page__mode-btn ${mode === 'batch' ? 'scanner-page__mode-btn--active' : ''}`}
            onClick={() => {
              setMode('batch');
              resetScan();
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="15" height="15" rx="2" ry="2" />
              <rect x="7" y="2" width="15" height="15" rx="2" ry="2" />
            </svg>
            Batch Scan
          </button>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => setShowCamera(true)}
          disabled={scanning}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          Use Camera
        </button>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="scanner-page__camera-modal">
          <div className="scanner-page__camera-wrapper animate-scale-in">
            <CameraCapture
              onCapture={handleCameraCapture}
              onClose={() => setShowCamera(false)}
            />
          </div>
        </div>
      )}

      {/* Upload Area */}
      {!showCamera && (
        <div className="scanner-page__upload animate-fade-in-up" style={{ animationDelay: '160ms' }}>
          <ImageUploader
            mode={mode}
            onImagesSelected={handleImagesSelected}
            disabled={scanning}
          />
        </div>
      )}

      {/* Scan Button */}
      {selectedFiles.length > 0 && !scanning && !singleResult && !batchResults && (
        <div className="scanner-page__action animate-fade-in-up">
          <button
            className="btn btn-primary btn-lg scanner-page__scan-btn"
            onClick={() => performScan()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7V5a2 2 0 012-2h2" />
              <path d="M17 3h2a2 2 0 012 2v2" />
              <path d="M21 17v2a2 2 0 01-2 2h-2" />
              <path d="M7 21H5a2 2 0 01-2-2v-2" />
              <circle cx="12" cy="12" r="4" />
            </svg>
            {mode === 'single' || selectedFiles.length === 1
              ? 'Analyze Leaf'
              : `Analyze ${selectedFiles.length} Leaves`}
          </button>
        </div>
      )}

      {/* Loading State */}
      {scanning && (
        <div className="scanner-page__loading animate-fade-in">
          <LoadingSpinner
            text={
              mode === 'batch'
                ? 'Analyzing batch images...'
                : 'Analyzing leaf patterns...'
            }
            progress={scanProgress}
          />
        </div>
      )}

      {/* Results */}
      {singleResult && (
        <div className="scanner-page__results">
          <ScanResults results={singleResult} imageUrl={singleImageUrl} />
          <div className="scanner-page__results-actions">
            <button className="btn btn-secondary" onClick={resetScan}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
              </svg>
              Scan Another
            </button>
          </div>
        </div>
      )}

      {batchResults && (
        <div className="scanner-page__results">
          <BatchScanResults batchResults={batchResults} />
          <div className="scanner-page__results-actions">
            <button className="btn btn-secondary" onClick={resetScan}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
              </svg>
              New Batch Scan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
