import React, { useEffect, useMemo, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analytics } from "@/lib/analytics";
import PropertySearchTabs from "./PropertySearchTabs";

/**
 * HERO COMPONENT – JHH/GHH unified
 * ------------------------------------------------------------
 * Simplified hero with Property24-style tabbed search.
 * Keeps: background images, gradient, sticky CTA, analytics.
 * Removed: diaspora banner, city pills, old search bar, A/B test.
 */

type Site = "jamaica" | "guyana" | "colombia" | "barbados" | "rwanda" | "ghana" | "namibia" | "south-africa" | "kenya" | "dominican-republic" | "trinidad";

export default function Hero({
  site,
}: {
  site: Site;
}) {
  const country = useMemo(() => {
    const countryNames: Record<Site, string> = {
      jamaica: "Jamaica",
      guyana: "Guyana",
      colombia: "Colombia",
      barbados: "Barbados",
      rwanda: "Rwanda",
      ghana: "Ghana",
      namibia: "Namibia",
      "south-africa": "South Africa",
      kenya: "Kenya",
      "dominican-republic": "Dominican Republic",
      trinidad: "Trinidad"
    };
    return countryNames[site] || "Jamaica";
  }, [site]);

  // Track hero view
  useEffect(() => {
    analytics.heroView("A", site);
  }, [site]);

  // Mobile image rotation
  const mobileImages = useMemo(() => {
    const countryCode = site;
    const availableImages: Record<string, string[]> = {
      guyana: [
        `/images/countries/${countryCode}/hero-mobile-1.jpg`,
        `/images/countries/${countryCode}/hero-mobile-2.jpg`
      ],
      jamaica: [
        `/images/countries/${countryCode}/hero-mobile-1.jpg`,
        `/images/countries/${countryCode}/hero-mobile-2.jpg`
      ]
    };
    return availableImages[countryCode] || [
      `/images/countries/${countryCode}/hero-mobile-1.jpg`
    ];
  }, [site]);

  // Desktop image with fallback
  const [desktopImageSrc, setDesktopImageSrc] = useState(() => {
    return `/images/countries/${site}/hero-desktop.jpg`;
  });
  const defaultDesktopImage = "/hero/hero-desktop.jpg";

  const [mobileImageIndex, setMobileImageIndex] = useState(0);
  useEffect(() => {
    if (mobileImages.length <= 1) return;
    const id = setInterval(() => {
      setMobileImageIndex((i) => (i + 1) % mobileImages.length);
    }, 4000);
    return () => clearInterval(id);
  }, [mobileImages.length]);

  // Sticky mobile CTA
  const [showSticky, setShowSticky] = useState(false);
  const [stickyTracked, setStickyTracked] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const shouldShow = window.scrollY > 120;
      setShowSticky(shouldShow);
      if (shouldShow && !stickyTracked) {
        analytics.stickyCtaView(site);
        setStickyTracked(true);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [site, stickyTracked]);

  return (
    <section className="relative w-full">
      {/* ── Hero Image Area ── */}
      <div className="relative h-[240px] lg:h-[360px] xl:h-[400px] overflow-hidden">
        {/* Desktop */}
        <img
          src={desktopImageSrc}
          alt={`${country} homes background`}
          className="hidden h-full w-full object-cover object-top md:block"
          fetchPriority="high"
          onError={(e) => {
            if (e.currentTarget.src !== defaultDesktopImage) {
              setDesktopImageSrc(defaultDesktopImage);
            }
          }}
        />
        {/* Mobile */}
        <div className="relative h-full w-full md:hidden">
          {mobileImages.map((imgSrc, index) => (
            <img
              key={imgSrc}
              src={imgSrc}
              alt={`${country} homes background ${index + 1}`}
              className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-1000 ease-in-out ${
                index === mobileImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              fetchPriority={index === 0 ? "high" : "low"}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ))}
        </div>
        {/* Gradient overlay — bottom-to-top for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/5" />

        {/* Title on image */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pb-6 lg:pb-20 text-center text-white">
          <h1 className="text-xl font-bold leading-tight drop-shadow-lg md:text-3xl lg:text-4xl">
            <span className="md:hidden">Find Property in {country}</span>
            <span className="hidden md:inline">Find Your Dream Property in {country}</span>
          </h1>
          <p className="mt-2 text-xs md:text-sm text-white/80 drop-shadow-md max-w-lg">
            <span className="md:hidden">Real listings. Verified agents. One platform.</span>
            <span className="hidden md:inline">Tired of Facebook? Real listings. Verified agents. One platform for {country} property.</span>
          </p>
        </div>
      </div>

      {/* ── Search Component — overlaps hero bottom ── */}
      <div className="relative z-10 -mt-12 lg:-mt-28 xl:-mt-32 px-4 lg:px-8">
        <Suspense fallback={<div className="max-w-6xl mx-auto h-32 bg-white/90 rounded-2xl animate-pulse shadow-lg" />}>
          <PropertySearchTabs variant="hero" />
        </Suspense>
      </div>

      {/* Sticky mobile CTA bar */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-4 left-1/2 z-50 w-[92%] -translate-x-1/2 rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-black/5 md:hidden"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium text-gray-800">
                Own a home or rental? <span className="hidden xs:inline">List free in minutes.</span>
              </div>
              <a
                href="/list"
                onClick={() => analytics.stickyCtaClick(site)}
                className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
              >
                Start Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// -------- Optional helper: derive site from host ----------------
export function getSiteFromHost(host?: string): Site | null {
  if (!host && typeof window !== "undefined") host = window.location.hostname;
  if (!host) return null;
  if (host.includes("jamaica")) return "jamaica";
  if (host.includes("colombia")) return "colombia";
  if (host.includes("guyana")) return "guyana";
  return null;
}
