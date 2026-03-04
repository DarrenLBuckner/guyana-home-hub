import Image from 'next/image';
import Link from 'next/link';

export default function TajPartnerBanner() {
  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-4">
      <Link
        href="/properties/developments/taj-dream-ogle"
        className="block w-full max-w-4xl mx-auto group"
      >
        {/* Desktop Banner - constrained width */}
        <div className="hidden md:block relative w-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <Image
            src="/images/taj-banner-desktop.png"
            alt="TAJ Dream Ogle - Luxury Condos from $150,000"
            width={4192}
            height={1024}
            className="w-full h-auto max-h-[180px] object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
            priority
          />
        </div>

        {/* Mobile Banner */}
        <div className="block md:hidden relative w-full overflow-hidden rounded-lg shadow-lg">
          <Image
            src="/images/taj-banner-mobile.png"
            alt="TAJ Dream Ogle - Luxury Condos from $150,000"
            width={3584}
            height={1184}
            className="w-full h-auto"
            priority
          />
        </div>
      </Link>
    </div>
  );
}
