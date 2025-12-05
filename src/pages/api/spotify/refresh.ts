import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const refreshToken = body.refresh_token;

    if (!refreshToken) {
      return new Response(
        JSON.stringify({ error: 'Missing refresh_token' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const clientId = import.meta.env.PUBLIC_SPOTIFY_CLIENT_ID;

    if (!clientId) {
      return new Response(
        JSON.stringify({ error: 'Missing Spotify configuration' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Request new access token using refresh token
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Token refresh failed:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to refresh token' }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const tokens = await response.json();

    return new Response(
      JSON.stringify({
        access_token: tokens.access_token,
        expires_in: tokens.expires_in,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Refresh token error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
