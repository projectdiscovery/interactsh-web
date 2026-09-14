/**
 * Copies `data` to the clipboard.
 *
 * The async Clipboard API (`navigator.clipboard.writeText`) is only available
 * in secure contexts; on Firefox served over plain HTTP `navigator.clipboard`
 * is `undefined`, and even when present the call can reject (permission
 * denied). Feature-detect it and fall back to the legacy
 * `document.execCommand('copy')` path so copying never throws unexpectedly
 * (see interactsh-web#208).
 */
export const copyDataToClipboard = async (data: string): Promise<void> => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(data);
      return;
    } catch {
      // Clipboard API present but rejected (e.g. permission denied) — fall through.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = data;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error('Unable to copy to clipboard');
  }
};
