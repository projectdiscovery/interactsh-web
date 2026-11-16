import { RUNTIME_ENV_GLOBAL, RUNTIME_ENV_KEYS, RuntimeEnv } from '@/lib/runtimeEnv';

// Read the environment on every request, not once at build time.
export const dynamic = 'force-dynamic';

export function GET(): Response {
  const env: RuntimeEnv = {};
  RUNTIME_ENV_KEYS.forEach((key) => {
    // Indexing with a variable keeps the build from inlining the value.
    const value = process.env[key];
    if (value) env[key] = value;
  });

  const body = `window.${RUNTIME_ENV_GLOBAL}=${JSON.stringify(env)};`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
