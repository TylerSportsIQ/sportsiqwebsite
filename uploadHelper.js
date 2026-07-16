/**
 * uploadHelper.js — CourtIQ film upload helper
 *
 * Handles the full 3-step upload flow:
 *   1. POST /api/upload/url  → get pre-signed S3 URL + gameId
 *   2. PUT to pre-signed URL → upload file directly to S3
 *   3. POST /api/upload/confirm → mark record as uploaded in DynamoDB
 *
 * Usage (from upload.html):
 *   import { uploadGameVideo } from './uploadHelper.js';
 *
 *   const result = await uploadGameVideo({
 *     file:       fileInputElement.files[0],
 *     teamId:     'team_001',
 *     gameDate:   '2025-03-15',
 *     opponent:   'East Side Eagles',
 *     location:   'Home — Fieldhouse',        // optional
 *     onProgress: (pct) => console.log(pct),  // optional, 0–100
 *   });
 *   // result = { gameId, s3Key, fileSizeBytes }
 */

// ─────────────────────────────────────────────
// CONFIG — update this to your backend URL
// before pilot, Aidan will provide the EC2 address
// ─────────────────────────────────────────────
const BACKEND_URL = "https://api.sportsiqus.com";

/**
 * Main upload function.
 * @param {object} options
 * @param {File}     options.file        - The video File object from a file input
 * @param {string}   options.teamId      - Team identifier (e.g. "team_001")
 * @param {string}   options.gameDate    - ISO date string (e.g. "2025-03-15")
 * @param {string}   options.opponent    - Opponent name
 * @param {string}  [options.location]   - Optional game location
 * @param {Function}[options.onProgress] - Optional callback(percent: number)
 * @returns {Promise<{gameId: string, s3Key: string, fileSizeBytes: number}>}
 */
export async function uploadGameVideo({ file, teamId, gameDate, opponent, location, onProgress }) {

  if (!file)     throw new Error('No file provided.');
  if (!teamId)   throw new Error('teamId is required.');
  if (!gameDate) throw new Error('gameDate is required.');
  if (!opponent) throw new Error('opponent is required.');

  // ── Step 1: Get pre-signed upload URL from backend ──
  const urlResponse = await fetch(`${BACKEND_URL}/api/upload/url`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      teamId,
      filename:    file.name,
      contentType: file.type || 'video/mp4',
      gameDate,
      opponent,
      ...(location ? { location } : {}),
    }),
  });

  if (!urlResponse.ok) {
    const err = await urlResponse.text();
    throw new Error(`Failed to get upload URL: ${err}`);
  }

  const { uploadUrl, gameId, s3Key } = await urlResponse.json();

  // ── Step 2: Upload file directly to S3 via pre-signed URL ──
  await uploadToS3({ file, uploadUrl, onProgress });

  // ── Step 3: Confirm upload with backend (updates DynamoDB status) ──
  const confirmResponse = await fetch(`${BACKEND_URL}/api/upload/confirm`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId, teamId }),
  });

  if (!confirmResponse.ok) {
    const err = await confirmResponse.text();
    throw new Error(`Upload confirmation failed: ${err}`);
  }

  const confirmed = await confirmResponse.json();

  return {
    gameId,
    s3Key,
    fileSizeBytes: confirmed.fileSizeBytes ?? file.size,
  };
}

/**
 * Uploads a file to S3 using a pre-signed URL with XHR
 * so we can report real upload progress.
 * @private
 */
function uploadToS3({ file, uploadUrl, onProgress }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type || 'video/mp4');

    // Progress reporting
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          onProgress(pct);
        }
      });
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (onProgress) onProgress(100);
        resolve();
      } else {
        reject(new Error(`S3 upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during S3 upload.'));
    xhr.ontimeout = () => reject(new Error('Upload timed out.'));

    xhr.send(file);
  });
}
