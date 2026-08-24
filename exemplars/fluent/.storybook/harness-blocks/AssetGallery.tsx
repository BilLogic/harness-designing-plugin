/**
 * AssetGallery — file-list + previews + download for binary assets.
 * Lists files from `dir` (relative to MDX location). Renders thumbnails for
 * raster/SVG; file icon for others. Each row has a download link.
 *
 * NOTE: Uses Vite's import.meta.glob for build-time directory enumeration.
 * Webpack equivalent would use require.context — adjust per your bundler.
 */

import React from 'react';

export type AssetGalleryProps = {
  dir: string;
};

const IMAGE_EXTS = /\.(svg|png|jpg|jpeg|gif|webp|avif)$/i;

export const AssetGallery: React.FC<AssetGalleryProps> = ({ dir }) => {
  // Vite-only — at build time, gather all files matching the glob
  // For Webpack, replace with require.context(dir, true, /\.(svg|png|jpg|jpeg|gif|webp)$/)
  // @ts-expect-error — import.meta.glob is Vite-specific
  const modules = typeof import.meta?.glob === 'function'
    // @ts-expect-error
    ? import.meta.glob('/docs/context/design-system/3-assets/**/*', { eager: true, as: 'url' })
    : {};

  const filtered = Object.entries(modules).filter(([path]) => path.includes(dir));

  if (filtered.length === 0) {
    return (
      <div className="harness-asset-gallery harness-empty">
        <p>No assets found at <code>{dir}</code>. Drop files there and refresh.</p>
      </div>
    );
  }

  return (
    <div className="harness-asset-gallery">
      {filtered.map(([path, url]) => {
        const filename = path.split('/').pop() || path;
        const isImage = IMAGE_EXTS.test(filename);
        return (
          <div key={path} className="harness-asset-card">
            <div className="harness-asset-preview">
              {isImage ? (
                <img src={url as string} alt={filename} />
              ) : (
                <div className="harness-asset-fileicon">📄</div>
              )}
            </div>
            <div className="harness-asset-meta">
              <code className="harness-asset-name">{filename}</code>
              <a href={url as string} download={filename} className="harness-asset-download">
                Download
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};
