import type { Handle } from '@sveltejs/kit';

// https://kit.svelte.dev/docs/hooks#server-hooks-handle
// https://edoverflow.com/2023/sveltekit-security-headers/
const securityHeaders = {
  // 'Cross-Origin-Embedder-Policy': 'require-corp',
  // 'Cross-Origin-Opener-Policy': 'same-origin',
  // [...]
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  // 'Content-Security-Policy': "..." // see "src/hooks.server.ts"
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=(), clipboard-read=(), clipboard-write=(), gamepad=(), speaker-selection=(), conversion-measurement=(), focus-without-user-activation=(), hid=(), idle-detection=(), interest-cohort=(), serial=(), sync-script=(), trust-token-redemption=(), window-placement=(), vertical-scroll=()',
  'Allow': 'GET, POST, PUT, DELETE',
  'X-XSS-Protection': '0',
}

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  Object.entries(securityHeaders).forEach(
    ([header, value]) => response.headers.set(header, value)
  );

  return response;
}
