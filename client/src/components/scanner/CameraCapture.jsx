import { useState, useRef, useCallback, useEffect } from 'react';
import './CameraCapture.css';

/**
 * Real-time camera capture component for scanning banana leaves.
 * Uses getUserMedia API for webcam access with capture functionality.
 */
export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [capturedImage, setCapturedImage] = useState(null);

  const startCamera = useCallback(async (facing) => {
    try {
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsReady(true);
        setError(null);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera permissions in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else {
        setError('Unable to access camera. Please try again.');
      }
    }
  }, []);

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode, startCamera]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(dataUrl);
  }, []);

  const confirmCapture = useCallback(() => {
    if (!capturedImage || !canvasRef.current) return;

    canvasRef.current.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `capture_${Date.now()}.jpg`, {
            type: 'image/jpeg',
          });
          onCapture?.(file);
        }
      },
      'image/jpeg',
      0.92
    );
  }, [capturedImage, onCapture]);

  const retake = useCallback(() => {
    setCapturedImage(null);
  }, []);

  const toggleCamera = useCallback(() => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
    setCapturedImage(null);
  }, []);

  const handleClose = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    onClose?.();
  }, [onClose]);

  return (
    <div className="camera-capture">
      <div className="camera-capture__viewport">
        {/* Video Feed */}
        <video
          ref={videoRef}
          className={`camera-capture__video ${capturedImage ? 'camera-capture__video--hidden' : ''}`}
          autoPlay
          playsInline
          muted
        />

        {/* Captured Image Preview */}
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured"
            className="camera-capture__preview"
          />
        )}

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="camera-capture__canvas" />

        {/* Scanning Overlay */}
        {isReady && !capturedImage && (
          <div className="camera-capture__overlay">
            <div className="camera-capture__frame">
              <div className="camera-capture__corner camera-capture__corner--tl" />
              <div className="camera-capture__corner camera-capture__corner--tr" />
              <div className="camera-capture__corner camera-capture__corner--bl" />
              <div className="camera-capture__corner camera-capture__corner--br" />
            </div>
            <span className="camera-capture__hint">
              Position the banana leaf within the frame
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="camera-capture__error">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        {/* Loading */}
        {!isReady && !error && (
          <div className="camera-capture__loading">
            <div className="camera-capture__loading-ring" />
            <span>Initializing camera...</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="camera-capture__controls">
        <button
          className="btn btn-ghost btn-icon camera-capture__btn-close"
          onClick={handleClose}
          aria-label="Close camera"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {capturedImage ? (
          <>
            <button className="btn btn-secondary" onClick={retake}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
              </svg>
              Retake
            </button>
            <button className="btn btn-primary btn-lg" onClick={confirmCapture}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Use Photo
            </button>
          </>
        ) : (
          <>
            <button
              className="camera-capture__shutter"
              onClick={capturePhoto}
              disabled={!isReady}
              aria-label="Capture photo"
            >
              <span className="camera-capture__shutter-inner" />
            </button>
            <button
              className="btn btn-ghost btn-icon"
              onClick={toggleCamera}
              aria-label="Switch camera"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 19H4a2 2 0 01-2-2V7a2 2 0 012-2h5l2-3h6l2 3h1a2 2 0 012 2v4" />
                <circle cx="12" cy="12" r="3" />
                <path d="M17 22l5-5-5-5" />
                <path d="M22 17H14" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
