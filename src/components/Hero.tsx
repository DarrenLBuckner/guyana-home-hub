import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analytics } from "@/lib/analytics";

/**
 * HERO COMPONENT – JHH/GHH unified
 * ------------------------------------------------------------
 * • Country‑aware copy (Jamaica/Guyana)
 * • Dynamic rotating subheadline
 * • A/B test (variant A vs B) with localStorage bucketing
 * • Mobile vs Desktop CTA hierarchy swap
 * • Sticky mobile CTA bar (appears after slight scroll)
 * • Responsive hero image with mobile/desktop sources
 * • Clean Tailwind, minimal dependencies, analytics hooks
 *
 * HOW TO USE
 *   <Hero site={"jamaica"} />  // jamaica | guyana
 *   Place in each home page under the navbar.
 *
 * TRACKING:
 *   Connected to Supabase analytics via /api/track endpoint
 */

// -------- Utility: simple persistent A/B bucketing ------------
function getABVariant(key: string, buckets = ["A", "B"]) {
  const storageKey = `ab_${key}`;
  try {
    const existing = localStorage.getItem(storageKey);
    if (existing) return existing as "A" | "B";
    const assigned = Math.random() < 0.5 ? buckets[0] : buckets[1];
    localStorage.setItem(storageKey, assigned);
    return assigned as "A" | "B";
  } catch {
    return "A"; // fail‑safe default
  }
}

// -------- Helpers --------------------------------------------
const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

type Site = "jamaica" | "guyana" | "barbados" | "rwanda" | "ghana" | "namibia" | "south-africa" | "kenya" | "dominican-republic" | "trinidad";

export default function Hero({
  site,
  desktopImage = "/hero/hero-desktop.jpg",
  mobileImage = "/hero/hero-mobile.jpg",
}: {
  site: Site;
  desktopImage?: string; // 1920x900 or similar
  mobileImage?: string; // 1080x1600 portrait crop
}) {
  const country = useMemo(() => {
    const countryNames: Record<Site, string> = {
      jamaica: "Jamaica",
      guyana: "Guyana", 
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

  // A/B: Variant A (buyer‑first); Variant B (seller‑first)
  const [variant, setVariant] = useState<"A" | "B">("A");
  useEffect(() => {
    const abVariant = getABVariant("hero_v1");
    setVariant(abVariant);
    
    // Track hero view with variant
    analytics.heroView(abVariant, site);
  }, [site]);

  // Mobile image rotation for cultural diversity
  const mobileImages = useMemo(() => {
    // Map site names to country folder names
    const countryMapping: Record<Site, string> = {
      jamaica: "jamaica",
      guyana: "guyana",
      barbados: "barbados",
      rwanda: "rwanda",
      ghana: "ghana",
      namibia: "namibia",
      "south-africa": "south-africa",
      kenya: "kenya",
      "dominican-republic": "dominican-republic",
      trinidad: "trinidad"
    };
    
    const countryCode = countryMapping[site] || "jamaica";
    
    // Always use country-specific images
    const countrySpecific = [
      `/images/countries/${countryCode}/hero-mobile-1.jpg`,
      `/images/countries/${countryCode}/hero-mobile-2.jpg`,
      `/images/countries/${countryCode}/hero-mobile-3.jpg`
    ];
    
    return countrySpecific;
  }, [site]);
  
  const [mobileImageIndex, setMobileImageIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setMobileImageIndex((i) => (i + 1) % mobileImages.length);
    }, 8000); // Change image every 8 seconds
    return () => clearInterval(id);
  }, [mobileImages.length]);

  // Rotating secondary line
  const rotating = useMemo(() => [
    "Buy. Rent. Sell — All in One Place.",
    `List Free Today. Reach verified buyers & renters across ${country} and the diaspora.`,
  ], [country]);
  const [rotIndex, setRotIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setRotIndex((i) => (i + 1) % rotating.length), 6000);
    return () => clearInterval(id);
  }, [rotating.length]);

  // Sticky mobile CTA visibility
  const [showSticky, setShowSticky] = useState(false);
  const [stickyTracked, setStickyTracked] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const shouldShow = window.scrollY > 120;
      setShowSticky(shouldShow);
      
      // Track sticky CTA view once when it first appears
      if (shouldShow && !stickyTracked) {
        analytics.stickyCtaView(site);
        setStickyTracked(true);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [site, stickyTracked]);

  const headline = variant === "A"
    ? `Find Your Perfect Home in ${country}`
    : `Sell or Rent Faster in ${country}`;

  const subheadline = variant === "A"
    ? `List Free Today. Get verified buyers and renters across ${country} and the diaspora.`
    : `Post your property free — keep every dollar and reach serious leads across ${country} & the diaspora.`;

  return (
    <section className="relative w-full">
      {/* Background Image with responsive sources */}
      <div className="absolute inset-0 -z-10">
        <picture>
          <source media="(max-width: 768px)" srcSet={mobileImages[mobileImageIndex]} />
          <img
            src={desktopImage}
            alt={`${country} homes background`}
            className="h-[78vh] w-full object-cover object-top transition-opacity duration-1000 ease-in-out"
            fetchPriority="high"
          />
        </picture>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="mx-auto flex h-[78vh] max-w-6xl flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="text-4xl font-extrabold leading-tight drop-shadow md:text-6xl">
          {headline}
        </h1>

        {/* Rotating subheadline */}
        <div className="mt-3 h-14 md:h-8">
          <AnimatePresence mode="wait">
            <motion.p key={rotIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="mx-auto max-w-2xl px-1 text-lg md:text-xl">
              {rotating[rotIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Search bar */}
        <div className="mt-5 w-full max-w-3xl">
          <form
            className="flex overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const q = (form.elements.namedItem("q") as HTMLInputElement)?.value?.trim();
              analytics.searchSubmit(q || "", site);
              
              // Route to search page with query
              if (q) {
                window.location.href = `/search?q=${encodeURIComponent(q)}`;
              }
            }}
          >
            <input
              name="q"
              aria-label="Search"
              placeholder={`Search by area, neighborhood, or keyword...`}
              className="w-full px-5 py-4 text-gray-800 placeholder-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              className="hidden shrink-0 bg-emerald-600 px-6 py-4 font-semibold text-white hover:bg-emerald-700 focus:outline-none md:block"
            >
              Search
            </button>
          </form>
        </div>

        {/* Popular quick chips (optional) */}
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
          {(() => {
            const citiesMap: Record<Site, string[]> = {
              jamaica: ["Kingston", "Spanish Town", "Portmore", "May Pen"],
              guyana: ["Georgetown", "Providence", "Eccles", "New Amsterdam"],
              barbados: ["Bridgetown", "St. Lawrence", "Oistins", "Speightstown"],
              rwanda: ["Kigali", "Butare", "Gitarama", "Ruhengeri"],
              ghana: ["Accra", "Kumasi", "Tamale", "Cape Coast"],
              namibia: ["Windhoek", "Swakopmund", "Walvis Bay", "Oshakati"],
              "south-africa": ["Cape Town", "Johannesburg", "Durban", "Pretoria"],
              kenya: ["Nairobi", "Mombasa", "Kisumu", "Nakuru"],
              "dominican-republic": ["Santo Domingo", "Santiago", "La Romana", "Puerto Plata"],
              trinidad: ["Port of Spain", "San Fernando", "Chaguanas", "Arima"]
            };
            return citiesMap[site] || citiesMap.jamaica;
          })().map((city) => (
            <button
              key={city}
              onClick={() => {
                analytics.quickSearch(city, site);
                // Navigate to search page with the city as query
                window.location.href = `/search?q=${encodeURIComponent(city)}`;
              }}
              className="rounded-full border border-white/70 bg-white/10 px-4 py-2 backdrop-blur hover:bg-white/20"
            >
              {city}
            </button>
          ))}
        </div>
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
  if (host.includes("guyana")) return "guyana";
  return null;
}