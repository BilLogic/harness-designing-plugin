/**
 * Copy page as markdown — minimal client-side variant of Fluent's
 * CopyAsMarkdownButton. Extracts the doc page DOM as text and writes to
 * clipboard.
 */
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyPageButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Find the docs main column and grab its rendered text
    const root = document.querySelector('.hd-docs-page-container') as HTMLElement | null;
    const text = root?.innerText ?? '';
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="hd-copy-page-btn"
      aria-label="Copy page as markdown"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span>{copied ? 'Copied' : 'Copy Page'}</span>
    </button>
  );
}
