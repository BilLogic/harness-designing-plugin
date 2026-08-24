/**
 * FigmaFrame — embedded Figma frame iframe.
 * Uses Figma's official embed URL pattern (figma.com/embed?embed_host=...&url=<encoded>).
 */

import React from 'react';

export type FigmaFrameProps = {
  url: string;
  height?: number;
};

export const FigmaFrame: React.FC<FigmaFrameProps> = ({ url, height = 600 }) => {
  const embedUrl = `https://www.figma.com/embed?embed_host=storybook&url=${encodeURIComponent(url)}`;
  return (
    <div className="harness-figma-frame">
      <iframe
        src={embedUrl}
        width="100%"
        height={height}
        allowFullScreen
        title="Figma frame"
        loading="lazy"
        style={{ border: '1px solid var(--color-outline-variant, #ddd)', borderRadius: '8px' }}
      />
    </div>
  );
};
