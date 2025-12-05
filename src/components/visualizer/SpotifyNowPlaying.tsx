import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Loader2 } from 'lucide-react';
import {
  generateRandomString,
  generateCodeChallenge,
  getRefreshToken,
  setRefreshToken,
  setAccessToken,
  clearTokens,
  getValidAccessToken,
} from '@/lib/spotify-auth';

interface Track {
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  progress_ms: number;
  duration_ms: number;
}

interface SpotifyResponse {
  isPlaying: boolean;
  track: Track | null;
}

export default function SpotifyNowPlaying() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState(5000);

  // Parse tokens from URL hash on mount (after OAuth redirect)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('tokens=')) {
      const tokensParam = hash.split('tokens=')[1]?.split('&')[0];
      if (tokensParam) {
        try {
          const tokensJson = atob(tokensParam);
          const tokens = JSON.parse(tokensJson);

          // Store tokens
          setRefreshToken(tokens.refresh_token);
          setAccessToken(tokens.access_token, tokens.expires_in);

          setIsAuthenticated(true);

          // Clear hash from URL
          window.history.replaceState(null, '', window.location.pathname);
        } catch (err) {
          console.error('Failed to parse tokens:', err);
          setError('Failed to authenticate');
        }
      }
    }

    // Check if already authenticated
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      setIsAuthenticated(true);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fetch currently playing track
  const fetchCurrentTrack = useCallback(async () => {
    try {
      const accessToken = await getValidAccessToken();

      if (!accessToken) {
        // Not authenticated or token refresh failed
        setIsAuthenticated(false);
        setIsLoading(false);
        clearTokens();
        return;
      }

      const response = await fetch('/api/spotify/currently-playing', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        // Token expired and refresh failed
        setIsAuthenticated(false);
        clearTokens();
        setError('Session expired. Please reconnect.');
        return;
      }

      if (response.status === 429) {
        // Rate limited
        const data = await response.json();
        setPollingInterval(data.retryAfter * 1000 || 30000);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch track');
      }

      const data: SpotifyResponse = await response.json();

      setCurrentTrack(data.track);
      setIsLoading(false);
      setError(null);

      // Reset polling interval if it was increased
      if (pollingInterval !== 5000) {
        setPollingInterval(5000);
      }
    } catch (err) {
      console.error('Error fetching track:', err);
      setError('Failed to load track');
      setIsLoading(false);

      // Increase polling interval on error
      setPollingInterval(10000);
    }
  }, [pollingInterval]);

  // Polling effect
  useEffect(() => {
    if (!isAuthenticated) return;

    // Fetch immediately
    fetchCurrentTrack();

    // Set up polling with visibility detection
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchCurrentTrack();
      }
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [isAuthenticated, pollingInterval, fetchCurrentTrack]);

  // Handle Spotify connection
  const handleConnect = async () => {
    try {
      // Generate PKCE verifier and challenge
      const codeVerifier = generateRandomString(128);
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // Store verifier in sessionStorage
      sessionStorage.setItem('spotify_code_verifier', codeVerifier);

      // Redirect to authorization endpoint
      window.location.href = `/api/spotify/authorize?code_challenge=${codeChallenge}&code_verifier=${codeVerifier}`;
    } catch (err) {
      console.error('Failed to start auth flow:', err);
      setError('Failed to connect to Spotify');
    }
  };

  // Handle retry
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    fetchCurrentTrack();
  };

  // Handle disconnect
  const handleDisconnect = () => {
    clearTokens();
    setIsAuthenticated(false);
    setCurrentTrack(null);
    setError(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-4 p-8 rounded-2xl bg-background/20 backdrop-blur-md">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/60" />
        <p className="text-lg text-muted-foreground/60">Loading...</p>
      </div>
    );
  }

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-background/20 backdrop-blur-md">
        <Music className="w-12 h-12 text-muted-foreground/60" />
        <p className="text-lg text-muted-foreground/80">Connect Spotify to see what's playing</p>
        <button
          onClick={handleConnect}
          className="px-6 py-3 mt-2 text-base font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Connect Spotify
        </button>
        {error && (
          <p className="text-sm text-red-400 mt-2">{error}</p>
        )}
      </div>
    );
  }

  // Error state
  if (error && !currentTrack) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-background/20 backdrop-blur-md">
        <p className="text-lg text-red-400">{error}</p>
        <div className="flex gap-3">
          <button
            onClick={handleRetry}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  // No track playing state
  if (!currentTrack) {
    return (
      <div className="flex items-center justify-center gap-4 p-8 rounded-2xl bg-background/20 backdrop-blur-md">
        <Music className="w-10 h-10 text-muted-foreground/60" />
        <p className="text-xl tablet:text-2xl font-medium text-muted-foreground/80">
          Not playing anything
        </p>
      </div>
    );
  }

  // Playing state
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentTrack.name + currentTrack.artist}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="flex items-center gap-6 p-6 rounded-2xl bg-background/20 backdrop-blur-md"
      >
        {/* Album Art */}
        <motion.img
          src={currentTrack.albumArt}
          alt={`${currentTrack.album} cover`}
          className="w-24 h-24 tablet:w-32 tablet:h-32 rounded-lg object-cover shadow-lg"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl tablet:text-2xl desktop:text-3xl font-semibold text-foreground truncate">
            {currentTrack.name}
          </h3>
          <p className="text-base tablet:text-lg desktop:text-xl text-muted-foreground/80 truncate mt-1">
            {currentTrack.artist}
          </p>
        </div>

        {/* Spotify Icon */}
        <Music className="w-8 h-8 text-primary flex-shrink-0" />
      </motion.div>
    </AnimatePresence>
  );
}
