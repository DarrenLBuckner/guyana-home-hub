export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import SearchClient from './SearchClient';

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="p-8">Loading…</p>}>
      <SearchClient />
    </Suspense>
  );
}
