'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const STORAGE_KEY_PREFIX = '__scroll_';
const MAX_ENTRIES = 50;
const MAX_RESTORE_ATTEMPTS = 5;
const RESTORE_RETRY_MS = 100;

/**
 * Attempts to scroll to the target Y position, retrying if the page
 * content hasn't loaded enough yet (e.g. async property listings).
 */
function attemptScrollRestore(targetY: number, attempt = 0) {
  window.scrollTo(0, targetY);

  // If we couldn't reach the target (content still loading), retry
  if (
    attempt < MAX_RESTORE_ATTEMPTS &&
    targetY > 0 &&
    Math.abs(window.scrollY - targetY) > 10
  ) {
    setTimeout(() => attemptScrollRestore(targetY, attempt + 1), RESTORE_RETRY_MS);
  }
}

function cleanupStorage() {
  try {
    const keys: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith(STORAGE_KEY_PREFIX)) {
        keys.push(key);
      }
    }
    if (keys.length > MAX_ENTRIES) {
      const toRemove = keys.slice(0, keys.length - MAX_ENTRIES);
      toRemove.forEach((key) => sessionStorage.removeItem(key));
    }
  } catch {
    // sessionStorage unavailable
  }
}

function ScrollRestorationInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isPopState = useRef(false);
  const prevUrl = useRef<string | null>(null);

  // Take manual control of scroll restoration & listen for back/forward
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const handlePopState = () => {
      isPopState.current = true;
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  // Continuously save scroll position (debounced)
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const saveScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const url = window.location.pathname + window.location.search;
        try {
          sessionStorage.setItem(
            STORAGE_KEY_PREFIX + url,
            String(Math.round(window.scrollY))
          );
        } catch {
          // storage full or unavailable
        }
      }, 150);
    };

    window.addEventListener('scroll', saveScroll, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', saveScroll);
    };
  }, []);

  // Handle route changes: restore on back/forward, scroll-to-top on fresh nav
  useEffect(() => {
    const search = searchParams?.toString();
    const url = pathname + (search ? `?${search}` : '');

    // Skip initial mount
    if (prevUrl.current === null) {
      prevUrl.current = url;
      return;
    }

    // Same URL — nothing to do
    if (prevUrl.current === url) {
      return;
    }

    // Save final scroll position for the page we're leaving
    try {
      sessionStorage.setItem(
        STORAGE_KEY_PREFIX + prevUrl.current,
        String(Math.round(window.scrollY))
      );
    } catch {
      // ignore
    }

    prevUrl.current = url;

    if (isPopState.current) {
      // Back/forward navigation — restore saved position
      isPopState.current = false;

      const saved = sessionStorage.getItem(STORAGE_KEY_PREFIX + url);
      if (saved !== null) {
        const scrollY = parseInt(saved, 10);
        if (!isNaN(scrollY)) {
          // Start restoration after the next paint
          requestAnimationFrame(() => {
            attemptScrollRestore(scrollY);
          });
        }
      } else if (window.location.hash) {
        // No saved position but URL has a hash — scroll to the anchor
        requestAnimationFrame(() => {
          const el = document.querySelector(window.location.hash);
          if (el) {
            el.scrollIntoView();
          }
        });
      }
    } else {
      // Fresh navigation (link click) — scroll to top unless anchored
      if (!window.location.hash) {
        window.scrollTo(0, 0);
      }
    }

    cleanupStorage();
  }, [pathname, searchParams]);

  return null;
}

export function ScrollRestoration() {
  return (
    <Suspense fallback={null}>
      <ScrollRestorationInner />
    </Suspense>
  );
}
