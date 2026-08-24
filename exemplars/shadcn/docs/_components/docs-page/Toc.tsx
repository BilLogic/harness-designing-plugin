/**
 * Right-rail "On this page" TOC. Port of FluentDocsPage's Toc.tsx
 * (ratiowed with shadcn tokens). Highlights the visible section via
 * IntersectionObserver.
 */
import { useEffect, useRef, useState } from 'react';

export const nameToHash = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]/gi, '-');

export interface TocProps {
  stories: { id: string; name: string }[];
  bestPractices?: boolean;
}

interface TocEntry {
  id: string;
  hash: string;
  label: string;
}

export function Toc({ stories, bestPractices = false }: TocProps) {
  const [selected, setSelected] = useState('');
  const navigating = useRef(false);

  // Compose the entries the rail tracks: stories, optional Best Practices,
  // and the always-trailing API Reference anchor.
  const entries: TocEntry[] = [
    ...stories.map((s) => ({ id: s.id, hash: nameToHash(s.name), label: s.name })),
    ...(bestPractices
      ? [{ id: 'best-practices', hash: 'best-practices', label: 'Best practices' }]
      : []),
    { id: 'api-reference', hash: 'api-reference', label: 'API Reference' },
  ];

  useEffect(() => {
    const obs = new IntersectionObserver(
      (e) => {
        if (navigating.current) {
          navigating.current = false;
          return;
        }
        for (const entry of e) {
          if (entry.intersectionRatio > 0.5) {
            setSelected(entry.target.id);
            return;
          }
        }
      },
      { threshold: [0.5] },
    );
    entries.forEach((entry) => {
      const el = document.getElementById(entry.hash);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stories, bestPractices]);

  return (
    <nav className="hd-toc" aria-label="On this page">
      <h3 className="hd-toc-heading">On this page</h3>
      <ol className="hd-toc-list">
        {entries.map((entry) => {
          const isActive = entry.hash === selected;
          return (
            <li
              key={entry.id}
              className={isActive ? 'hd-toc-item hd-toc-item--active' : 'hd-toc-item'}
            >
              <a
                href={`#${entry.hash}`}
                onClick={() => {
                  navigating.current = true;
                  setSelected(entry.hash);
                }}
              >
                {entry.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
