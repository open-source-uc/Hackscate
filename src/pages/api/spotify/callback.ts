import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request, redirect }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state'); // This is the code_verifier
  const error = url.searchParams.get('error');

  // Handle authorization errors
  if (error) {
    return redirect(`/visualizer?error=${encodeURIComponent(error)}`, 302);
  }

  if (!code || !state) {
    return redirect('/visualizer?error=missing_code_or_state', 302);
  }

  const clientId = import.meta.env.PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = import.meta.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return redirect('/visualizer?error=missing_config', 302);
  }

  const codeVerifier = state;

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange failed:', errorData);
      return redirect('/visualizer?error=token_exchange_failed', 302);
    }

    const tokens = await tokenResponse.json();

    // Encode tokens as base64 to pass via URL hash (client-side only)
    const tokensData = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
    };

    const tokensBase64 = btoa(JSON.stringify(tokensData));

    // Redirect to visualizer with tokens in URL hash (not visible in server logs)
    return redirect(`/visualizer#tokens=${tokensBase64}`, 302);
  } catch (error) {
    console.error('Callback error:', error);
    return redirect('/visualizer?error=callback_failed', 302);
  }
};
