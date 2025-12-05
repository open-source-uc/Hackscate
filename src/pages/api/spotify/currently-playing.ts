import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  // Get access token from Authorization header
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ error: 'Missing or invalid authorization header' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const accessToken = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    // Fetch currently playing track from Spotify
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Handle different response codes
    if (response.status === 204 || response.status === 200 && !response.headers.get('content-length')) {
      // No content - nothing is playing
      return new Response(
        JSON.stringify({
          isPlaying: false,
          track: null,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (response.status === 401) {
      // Unauthorized - token expired
      return new Response(
        JSON.stringify({ error: 'Token expired' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (response.status === 429) {
      // Rate limited
      const retryAfter = response.headers.get('Retry-After') || '30';
      return new Response(
        JSON.stringify({ error: 'Rate limited', retryAfter: parseInt(retryAfter) }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!response.ok) {
      console.error('Spotify API error:', response.status, await response.text());
      return new Response(
        JSON.stringify({ error: 'Failed to fetch currently playing track' }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();

    // Format the response
    const trackData = {
      isPlaying: data.is_playing,
      track: data.item ? {
        name: data.item.name,
        artist: data.item.artists.map((artist: any) => artist.name).join(', '),
        album: data.item.album.name,
        albumArt: data.item.album.images[0]?.url || '', // Largest image first
        progress_ms: data.progress_ms,
        duration_ms: data.item.duration_ms,
      } : null,
    };

    return new Response(JSON.stringify(trackData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching currently playing:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
