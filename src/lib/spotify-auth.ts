/**
 * Spotify OAuth PKCE and Token Management Utilities
 */

// Generate a cryptographically secure random string
export function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

// Base64 URL encoding (RFC 4648 §5)
function base64URLEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const binary = String.fromCharCode(...bytes);
  const base64 = btoa(binary);
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Generate SHA256 hash
async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await crypto.subtle.digest('SHA-256', data);
}

// Generate PKCE code challenge from verifier
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const hashed = await sha256(verifier);
  return base64URLEncode(hashed);
}

// Token storage keys
const REFRESH_TOKEN_KEY = 'spotify_refresh_token';
const ACCESS_TOKEN_KEY = 'spotify_access_token';
const TOKEN_EXPIRY_KEY = 'spotify_token_expiry';

// Get refresh token from localStorage
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

// Set refresh token in localStorage
export function setRefreshToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

// Get access token from sessionStorage (in-memory alternative)
export function getAccessToken(): { token: string; expiresAt: number } | null {
  if (typeof window === 'undefined') return null;

  const token = sessionStorage.getItem(ACCESS_TOKEN_KEY);
  const expiryStr = sessionStorage.getItem(TOKEN_EXPIRY_KEY);

  if (!token || !expiryStr) return null;

  const expiresAt = parseInt(expiryStr, 10);

  // Check if token is expired
  if (Date.now() >= expiresAt) {
    // Token expired, clear it
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
    return null;
  }

  return { token, expiresAt };
}

// Set access token in sessionStorage with expiration
export function setAccessToken(token: string, expiresIn: number): void {
  if (typeof window === 'undefined') return;

  // expiresIn is in seconds, convert to ms and subtract 60s buffer
  const expiresAt = Date.now() + (expiresIn - 60) * 1000;

  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt.toString());
}

// Clear all tokens
export function clearTokens(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
}

// Refresh access token using refresh token
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch('/api/spotify/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      // Refresh failed, clear tokens
      clearTokens();
      return null;
    }

    const data = await response.json();
    setAccessToken(data.access_token, data.expires_in);

    return data.access_token;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    clearTokens();
    return null;
  }
}

// Get a valid access token (refresh if needed)
export async function getValidAccessToken(): Promise<string | null> {
  const tokenData = getAccessToken();

  if (tokenData) {
    return tokenData.token;
  }

  // Token doesn't exist or expired, try to refresh
  return await refreshAccessToken();
}
