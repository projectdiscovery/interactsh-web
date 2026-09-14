/**
 * Regression test for projectdiscovery/interactsh-web#208.
 *
 * Firefox — and any browser served over plain HTTP — does not expose the
 * async Clipboard API: `navigator.clipboard` is `undefined`, so the previous
 * implementation (`navigator.clipboard.writeText(data)` without a guard) threw
 * `TypeError: can't access property "writeText", navigator.clipboard is undefined`.
 *
 * Run with: `node --test tests/clipboard.test.mts` (Node >= 23, native type stripping).
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { copyDataToClipboard } from '../src/lib/clipboard.ts';

interface DomStubState {
  copiedText: string;
  execResult: boolean;
}

/** Node >= 22 exposes a read-only global `navigator` getter — redefine it via defineProperty. */
function setNavigator(value: unknown): void {
  Object.defineProperty(globalThis, 'navigator', { value, configurable: true, writable: true });
}

/** Minimal DOM/navigator stub mimicking a browser without the Clipboard API. */
function stubBrowserEnv(): DomStubState {
  const state: DomStubState = { copiedText: '', execResult: true };
  const textarea: {
    value: string;
    setAttribute: () => void;
    select: () => void;
    style: Record<string, string>;
  } = {
    value: '',
    setAttribute: () => {},
    select: () => {},
    style: {},
  };

  // navigator exists but has no `clipboard` member (Firefox over HTTP).
  setNavigator({});
  (globalThis as any).document = {
    createElement: () => textarea,
    body: { appendChild: () => {}, removeChild: () => {} },
    execCommand: () => {
      state.copiedText = textarea.value;
      return state.execResult;
    },
  };
  return state;
}

test('copyDataToClipboard copies data when the Clipboard API is unavailable (Firefox over HTTP)', async () => {
  const state = stubBrowserEnv();
  await copyDataToClipboard('https://example.oast.fun/correlation-id');
  assert.equal(state.copiedText, 'https://example.oast.fun/correlation-id');
});

test('copyDataToClipboard uses the Clipboard API when it is available', async () => {
  let written = '';
  setNavigator({
    clipboard: {
      writeText: (text: string): Promise<void> => {
        written = text;
        return Promise.resolve();
      },
    },
  });
  (globalThis as any).document = undefined; // fallback must not be reached

  await copyDataToClipboard('payload-123');

  assert.equal(written, 'payload-123');
});

test('copyDataToClipboard falls back to execCommand when the Clipboard API rejects (permission denied)', async () => {
  const state = stubBrowserEnv();
  setNavigator({
    clipboard: {
      writeText: (): Promise<void> => Promise.reject(new DOMException('Permission denied', 'NotAllowedError')),
    },
  });

  await copyDataToClipboard('secret-value');

  assert.equal(state.copiedText, 'secret-value');
});
