// Configuration that can be set when the server starts (for example with
// `docker run -e NEXT_PUBLIC_HOST=...`) instead of only when the app is built.
//
// Next.js inlines NEXT_PUBLIC_* variables into the client bundle at build
// time, so a prebuilt image never sees variables passed to the container.
// The `/env.js` route reads them from the server environment on every request
// and exposes them on `window`, where the client picks them up.

export const RUNTIME_ENV_GLOBAL = '__INTERACTSH_ENV__';

export const RUNTIME_ENV_KEYS = [
  'NEXT_PUBLIC_HOST',
  'NEXT_PUBLIC_TOKEN',
  'NEXT_PUBLIC_CIDL',
  'NEXT_PUBLIC_CIDN',
] as const;

export type RuntimeEnvKey = (typeof RUNTIME_ENV_KEYS)[number];
export type RuntimeEnv = Partial<Record<RuntimeEnvKey, string>>;

declare global {
  interface Window {
    [RUNTIME_ENV_GLOBAL]?: RuntimeEnv;
  }
}

// Returns the value set when the server started, or undefined when it was not
// set (or when the app is served without the `/env.js` route).
export const getRuntimeEnv = (key: RuntimeEnvKey): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  const value = window[RUNTIME_ENV_GLOBAL]?.[key];
  return typeof value === 'string' && value !== '' ? value : undefined;
};
