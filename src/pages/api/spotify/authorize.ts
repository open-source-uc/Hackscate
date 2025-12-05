import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ request, redirect }) => {
  const url = new URL(request.url);
  const codeChallenge = url.searchParams.get('code_challenge');
  const codeVerifier = url.searchParams.get('code_verifier');

  if (!codeChallenge || !codeVerifier) {
    return new Response('Missing code_challenge or code_verifier', { status: 400 });
  }

  const clientId = import.meta.env.PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = import.meta.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return new Response('Missing Spotify configuration', { status: 500 });
  }

  // Build Spotify authorization URL
  const scope = 'user-read-currently-playing';
  const state = codeVerifier; // Pass verifier as state for callback retrieval

  const spotifyAuthUrl = new URL('https://accounts.spotify.com/authorize');
  spotifyAuthUrl.searchParams.append('client_id', clientId);
  spotifyAuthUrl.searchParams.append('response_type', 'code');
  spotifyAuthUrl.searchParams.append('redirect_uri', redirectUri);
  spotifyAuthUrl.searchParams.append('scope', scope);
  spotifyAuthUrl.searchParams.append('code_challenge_method', 'S256');
  spotifyAuthUrl.searchParams.append('code_challenge', codeChallenge);
  spotifyAuthUrl.searchParams.append('state', state);

  return redirect(spotifyAuthUrl.toString(), 302);
};
