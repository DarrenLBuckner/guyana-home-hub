'use client';

// Tell Next.js to render this page entirely on the client
export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';  // ← renamed

const BrowseClient = dynamicImport(
  () => import('@/components/BrowseClient'),
  { ssr: false }
);

export default function BrowsePage() {
  return <BrowseClient />;
}
