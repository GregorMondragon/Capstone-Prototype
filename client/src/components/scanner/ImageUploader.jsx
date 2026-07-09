import { useState, useRef, useCallback } from 'react';
import './ImageUploader.css';

/**
 * Image upload component supporting drag & drop, file picker, and batch mode.
 * Validates file types and sizes before accepting.
 */
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_BATCH_FILES = 20;

export default function ImageUploader({
  mode = 'single',
  onImagesSelected,
  disabled = false,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return `"${file.name}" is not a supported format. Use JPG, PNG, or WEBP.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `"${file.name}" exceeds the 10MB size limit.`;
    }
    return null;
  };

  const processFiles = useCallback(
    (fileList) => {
      const files = Array.from(fileList);
      const validFiles = [];
      const newErrors = [];

      const limit = mode === 'single' ? 1 : MAX_BATCH_FILES;
      const filesToProcess = files.slice(0, limit);

      filesToProcess.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          newErrors.push(error);
        } else {
          validFiles.push(file);
        }
      });

      if (files.length > limit) {
        newErrors.push(`Only ${limit} file(s) allowed. Extra files were ignored.`);
      }

      setErrors(newErrors);

      if (validFiles.length > 0) {
        const newPreviews = validFiles.map((file) => ({
          file,
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
        }));

        if (mode === 'single') {
          // Clean up old previews
          previews.forEach((p) => URL.revokeObjectURL(p.url));
          setPreviews(newPreviews);
        } else {
          setPreviews((prev) => [...prev, ...newPreviews].slice(0, MAX_BATCH_FILES));
        }

        const allFiles =
          mode === 'single'
            ? validFiles
            : [...previews.map((p) => p.file), ...validFiles].slice(0, MAX_BATCH_FILES);

        onImagesSelected?.(allFiles);
      }
    },
    [mode, previews, onImagesSelected]
  );

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (!disabled && e.dataTransfer.files?.length) {
        processFiles(e.dataTransfer.files);
      }
    },
    [disabled, processFiles]
  );

  const handleFileInput = useCallback(
    (e) => {
      if (e.target.files?.length) {
        processFiles(e.target.files);
        e.target.value = '';
      }
    },
    [processFiles]
  );

  const removePreview = useCallback(
    (index) => {
      setPreviews((prev) => {
        const updated = [...prev];
        URL.revokeObjectURL(updated[index].url);
        updated.splice(index, 1);
        onImagesSelected?.(updated.map((p) => p.file));
        return updated;
      });
    },
    [onImagesSelected]
  );

  const clearAll = useCallback(() => {
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews([]);
    setErrors([]);
    onImagesSelected?.([]);
  }, [previews, onImagesSelected]);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="image-uploader">
      {/* Drop Zone */}
      <div
        className={`image-uploader__dropzone ${dragActive ? 'image-uploader__dropzone--active' : ''} ${disabled ? 'image-uploader__dropzone--disabled' : ''} ${previews.length > 0 ? 'image-uploader__dropzone--has-files' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label={`Upload ${mode === 'single' ? 'an image' : 'images'} for disease detection`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          multiple={mode === 'batch'}
          onChange={handleFileInput}
          className="image-uploader__input"
          disabled={disabled}
        />

        <div className="image-uploader__dropzone-content">
          <div className="image-uploader__icon">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div className="image-uploader__dropzone-text">
            <span className="image-uploader__primary-text">
              {dragActive
                ? 'Release to upload'
                : `Drop ${mode === 'single' ? 'an image' : 'images'} here`}
            </span>
            <span className="image-uploader__secondary-text">
              or click to browse • JPG, PNG, WEBP
            </span>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="image-uploader__errors">
          {errors.map((err, i) => (
            <div key={i} className="image-uploader__error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {err}
            </div>
          ))}
        </div>
      )}

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="image-uploader__previews">
          <div className="image-uploader__preview-header">
            <span className="image-uploader__preview-count">
              {previews.length} {previews.length === 1 ? 'image' : 'images'} selected
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
            >
              Clear all
            </button>
          </div>
          <div className="image-uploader__preview-grid">
            {previews.map((preview, index) => (
              <div key={preview.url} className="image-uploader__preview-item">
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="image-uploader__preview-image"
                />
                <div className="image-uploader__preview-overlay">
                  <span className="image-uploader__preview-name" title={preview.name}>
                    {preview.name}
                  </span>
                  <span className="image-uploader__preview-size">
                    {formatFileSize(preview.size)}
                  </span>
                </div>
                <button
                  className="image-uploader__preview-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePreview(index);
                  }}
                  aria-label={`Remove ${preview.name}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
