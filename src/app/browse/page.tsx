// src/app/browse/page.tsx
import React, { Suspense } from 'react';
export const dynamic = 'force-dynamic';

import BrowseClient from './BrowseClient';

export default function BrowsePage() {
  return (
    <Suspense fallback={<p className="text-center mt-20">Loading properties…</p>}>
      <BrowseClient />
    </Suspense>
  );
}
