import dynamic from 'next/dynamic';

const BrowseClient = dynamic(
  () => import('@/components/BrowseClient'),
  { ssr: false }  // ← ensures this component only renders on the client
);

export default function BrowsePage() {
  return <BrowseClient />;
}
