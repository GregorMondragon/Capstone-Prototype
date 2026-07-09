/**
 * API service layer for communicating with the FastAPI backend.
 * Handles all HTTP requests for scanning and history management.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Helper to handle API responses consistently.
 */
async function handleResponse(response) {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Request failed (${response.status})`);
  }
  return response.json();
}

/**
 * Scan a single image for disease detection.
 * @param {File} imageFile - The image file to scan
 * @returns {Promise<Object>} Prediction results
 */
export async function scanSingleImage(imageFile) {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await fetch(`${API_BASE}/scan/single`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse(response);
}

/**
 * Scan multiple images in batch.
 * @param {File[]} imageFiles - Array of image files to scan
 * @returns {Promise<Object>} Batch prediction results
 */
export async function scanBatchImages(imageFiles) {
  const formData = new FormData();
  imageFiles.forEach((file) => {
    formData.append('files', file);
  });

  const response = await fetch(`${API_BASE}/scan/batch`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse(response);
}

/**
 * Retrieve scan history from the backend.
 * @param {number} limit - Maximum number of records to fetch
 * @param {number} offset - Pagination offset
 * @returns {Promise<Object>} Scan history records
 */
export async function getScanHistory(limit = 50, offset = 0) {
  const response = await fetch(
    `${API_BASE}/scan/history?limit=${limit}&offset=${offset}`
  );
  return handleResponse(response);
}

/**
 * Delete a scan record from history.
 * @param {number} scanId - The ID of the scan record to delete
 * @returns {Promise<Object>} Deletion confirmation
 */
export async function deleteScanRecord(scanId) {
  const response = await fetch(`${API_BASE}/scan/history/${scanId}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

/**
 * Clear all scan history records.
 * @returns {Promise<Object>} Confirmation
 */
export async function clearAllHistory() {
  const response = await fetch(`${API_BASE}/scan/history`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

/**
 * Get scan analytics/statistics.
 * @returns {Promise<Object>} Analytics data
 */
export async function getScanAnalytics() {
  const response = await fetch(`${API_BASE}/scan/analytics`);
  return handleResponse(response);
}

/**
 * Health check for the backend API.
 * @returns {Promise<Object>} Server health status
 */
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      signal: AbortSignal.timeout(5000),
    });
    return handleResponse(response);
  } catch {
    return { status: 'offline' };
  }
}
