"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────
type Tab = "buy" | "rent" | "commercial" | "developments";

interface PropertySearchTabsProps {
  variant: "hero" | "listing";
  defaultTab?: Tab;
}

const TABS: { key: Tab; label: string }[] = [
  { key: "buy", label: "Buy" },
  { key: "rent", label: "Rent" },
  { key: "commercial", label: "Commercial" },
  { key: "developments", label: "Developments" },
];

// Tab → destination page mapping
const TAB_ROUTES: Record<Tab, string> = {
  buy: "/properties/buy",
  rent: "/properties/rent",
  commercial: "/properties/commercial",
  developments: "/properties/developments",
};

// ─── Component ───────────────────────────────────────────────────────
export default function PropertySearchTabs({
  variant,
  defaultTab = "buy",
}: PropertySearchTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);

  // On listing pages, switching tabs navigates to the other page
  const handleTabChange = useCallback(
    (tab: Tab) => {
      setActiveTab(tab);
      if (variant === "listing" && tab !== defaultTab) {
        router.push(TAB_ROUTES[tab]);
      }
    },
    [variant, defaultTab, router]
  );

  // Search navigates to the target page with params (hero) or updates URL (listing)
  const handleSearch = useCallback(() => {
    const targetUrl = TAB_ROUTES[activeTab];
    // TODO: Append filter params to URL
    if (variant === "hero") {
      router.push(targetUrl);
    } else {
      router.replace(targetUrl, { scroll: false });
    }
  }, [activeTab, variant, router]);

  const isHero = variant === "hero";

  return (
    <div
      className={
        isHero
          ? "w-full max-w-3xl mx-auto"
          : "w-full bg-white border-b shadow-sm"
      }
    >
      {/* ── Tab Bar ── */}
      <div
        className={
          isHero
            ? "flex border-b border-white/30"
            : "flex border-b border-gray-200 max-w-7xl mx-auto px-4"
        }
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`relative px-5 py-3 text-sm font-semibold transition-colors ${
              activeTab === tab.key
                ? isHero
                  ? "text-white"
                  : "text-green-700"
                : isHero
                ? "text-white/70 hover:text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {/* Active underline */}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-green-500 rounded-t" />
            )}
          </button>
        ))}
      </div>

      {/* ── Filter Area (placeholder — will be filled in Step 2) ── */}
      <div
        className={
          isHero
            ? "bg-white rounded-b-2xl p-4 shadow-lg"
            : "max-w-7xl mx-auto p-4"
        }
      >
        <p className="text-gray-400 text-sm mb-4">
          Filters for <span className="font-medium text-gray-600">{activeTab}</span> tab
        </p>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Search className="w-5 h-5" />
          Search
        </button>
      </div>
    </div>
  );
}
