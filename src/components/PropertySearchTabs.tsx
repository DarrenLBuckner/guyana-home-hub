"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────
type Tab = "buy" | "rent" | "commercial" | "developments";
type Currency = "GYD" | "USD";
interface PropertySearchTabsProps {
  variant: "hero" | "listing";
  defaultTab?: Tab;
}

// ─── Tab config ───────────────────────────────────────────────────────
const TABS: { key: Tab; label: string }[] = [
  { key: "buy", label: "Buy" },
  { key: "rent", label: "Rent" },
  { key: "commercial", label: "Commercial" },
  { key: "developments", label: "Developments" },
];

const TAB_ROUTES: Record<Tab, string> = {
  buy: "/properties/buy",
  rent: "/properties/rent",
  commercial: "/properties/commercial",
  developments: "/properties/developments",
};

// ─── Property types per tab (values match DB check constraint exactly) ─
const BUY_TYPES = [
  { value: "House", label: "House" },
  { value: "Apartment", label: "Apartment" },
  { value: "Condo", label: "Condo" },
  { value: "Multi-family", label: "Multi-Family Home" },
  { value: "Land", label: "Land" },
  { value: "Residential Land", label: "Residential Land" },
];

const RENT_TYPES = [
  { value: "House", label: "House" },
  { value: "Apartment", label: "Apartment" },
  { value: "Condo", label: "Condo" },
  { value: "Multi-family", label: "Multi-Family" },
];

const COMMERCIAL_TYPES = [
  { value: "Office", label: "Office Space" },
  { value: "Retail", label: "Retail / Shop" },
  { value: "Warehouse", label: "Warehouse" },
  { value: "Industrial", label: "Industrial" },
  { value: "Mixed Use", label: "Mixed Use" },
  { value: "Commercial Land", label: "Commercial Land" },
];

const DEVELOPMENT_TYPES = [
  { value: "House", label: "New Construction Home" },
  { value: "Apartment", label: "Apartment Complex" },
  { value: "Condo", label: "Condominium" },
  { value: "Multi-family", label: "Multi-Family Development" },
  { value: "Commercial", label: "Mixed Use Development" },
];

// ─── Price presets ────────────────────────────────────────────────────
const BUY_PRICES_GYD = {
  min: [5000000, 10000000, 15000000, 20000000, 30000000, 50000000, 75000000, 100000000],
  max: [10000000, 20000000, 30000000, 50000000, 75000000, 100000000, 150000000, 200000000, 300000000],
};
const BUY_PRICES_USD = {
  min: [25000, 50000, 75000, 100000, 150000, 200000, 300000, 500000],
  max: [50000, 100000, 150000, 200000, 300000, 500000, 750000, 1000000, 2000000],
};
const RENT_PRICES_GYD = {
  min: [50000, 100000, 150000, 200000, 300000, 500000],
  max: [100000, 200000, 300000, 500000, 750000, 1000000, 1500000],
};
const RENT_PRICES_USD = {
  min: [200, 500, 750, 1000, 1500, 2000, 3000],
  max: [500, 1000, 1500, 2000, 3000, 5000, 7500, 10000],
};

function formatPresetPrice(value: number, currency: Currency): string {
  const symbol = currency === "GYD" ? "G$" : "$";
  if (value >= 1000000) return `${symbol}${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`;
  if (value >= 1000) return `${symbol}${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
  return `${symbol}${value.toLocaleString()}`;
}

// ─── Property Type Dropdown ───────────────────────────────────────────
function PropertyTypeDropdown({
  selected, onChange, groups, isHero,
}: {
  selected: string[];
  onChange: (types: string[]) => void;
  groups: { label: string; types: { value: string; label: string }[] }[];
  isHero: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const toggle = (val: string) => {
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);
  };
  const displayText =
    selected.length === 0 ? "Property Type" :
    selected.length === 1 ? groups.flatMap((g) => g.types).find((t) => t.value === selected[0])?.label || selected[0] :
    `${selected.length} types`;

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-3 border ${isHero ? "rounded-full" : "rounded-lg"} text-sm text-left transition-colors min-h-[44px] ${
          selected.length > 0 ? "border-green-500 text-green-700 bg-green-50" : "border-gray-200 text-gray-700 bg-white"
        }`}
      >
        <div>
          <div className="text-xs text-gray-500 leading-none mb-0.5">Property Type</div>
          <div className="font-medium">{displayText}</div>
        </div>
        <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {groups.map((group) => (
            <div key={group.label}>
              {groups.length > 1 && (
                <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50">
                  {group.label}
                </div>
              )}
              {group.types.map((t) => (
                <label key={t.value} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={selected.includes(t.value)}
                    onChange={() => toggle(t.value)}
                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">{t.label}</span>
                </label>
              ))}
            </div>
          ))}
          {selected.length > 0 && (
            <div className="border-t px-4 py-2">
              <button onClick={() => { onChange([]); setOpen(false); }} className="text-xs text-red-500 hover:text-red-600">
                Clear selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Price Dropdown ───────────────────────────────────────────────────
function PriceDropdown({
  label, value, onChange, presets, currency, pillShape,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  presets: number[];
  currency: Currency;
  pillShape?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualValue, setManualValue] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setManualMode(false); }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const displayValue = value ? formatPresetPrice(Number(value), currency) : "Any";

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-3 border ${pillShape ? "rounded-full" : "rounded-lg"} text-sm text-left transition-colors min-h-[44px] ${
          value ? "border-green-500 text-green-700 bg-green-50" : "border-gray-200 text-gray-700 bg-white"
        }`}
      >
        <div>
          <div className="text-xs text-gray-500 leading-none mb-0.5">{label}</div>
          <div className="font-medium">{displayValue}</div>
        </div>
        <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          <button onClick={() => { onChange(""); setOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 min-h-[44px] ${!value ? "text-green-600 font-medium" : "text-gray-700"}`}>Any</button>
          {presets.map((p) => (
            <button key={p} onClick={() => { onChange(String(p)); setOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 min-h-[44px] ${value === String(p) ? "text-green-600 font-medium bg-green-50" : "text-gray-700"}`}>
              {formatPresetPrice(p, currency)}
            </button>
          ))}
          <div className="border-t">
            {!manualMode ? (
              <button onClick={() => setManualMode(true)} className="w-full text-left px-4 py-2.5 text-sm text-blue-600 hover:bg-gray-50 min-h-[44px]">Enter amount...</button>
            ) : (
              <div className="p-3 flex gap-2">
                <input type="number" placeholder="Amount" value={manualValue} onChange={(e) => setManualValue(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" autoFocus />
                <button onClick={() => { if (manualValue) onChange(manualValue); setManualMode(false); setManualValue(""); setOpen(false); }}
                  className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────
export default function PropertySearchTabs({
  variant,
  defaultTab = "buy",
}: PropertySearchTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);
  const [tabDirection, setTabDirection] = useState<"left" | "right">("right");
  const [animating, setAnimating] = useState(false);

  // ── Filter state ──
  const [selectedTypes, setSelectedTypes] = useState<string[]>(() => {
    const t = searchParams.get("type");
    return t ? t.split(",") : [];
  });
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [currency, setCurrency] = useState<Currency>(
    (searchParams.get("currency") as Currency) || "GYD"
  );
  const [beds, setBeds] = useState(searchParams.get("beds") || "");
  const [baths, setBaths] = useState(searchParams.get("baths") || "");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [showMore, setShowMore] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  // ── Derived values ──
  const isHero = variant === "hero";
  const showBedBath = activeTab === "buy" || activeTab === "rent";

  // ── Property type groups per tab ──
  const propertyTypeGroups = (() => {
    if (activeTab === "commercial") return [{ label: "Commercial", types: COMMERCIAL_TYPES }];
    if (activeTab === "developments") return [{ label: "Development Type", types: DEVELOPMENT_TYPES }];
    if (activeTab === "rent") return [{ label: "Property Type", types: RENT_TYPES }];
    return [{ label: "Property Type", types: BUY_TYPES }];
  })();

  // ── Price presets per tab + currency ──
  const pricePresets = (() => {
    if (activeTab === "rent") return currency === "GYD" ? RENT_PRICES_GYD : RENT_PRICES_USD;
    return currency === "GYD" ? BUY_PRICES_GYD : BUY_PRICES_USD;
  })();

  const moreFilterCount = baths ? 1 : 0;
  const hasAnyFilter = selectedTypes.length > 0 || minPrice || maxPrice || beds || baths;

  // ── Tab change ──
  const handleTabChange = useCallback(
    (tab: Tab) => {
      if (tab === activeTab) return;
      const currentIndex = TABS.findIndex((t) => t.key === activeTab);
      const nextIndex = TABS.findIndex((t) => t.key === tab);
      setTabDirection(nextIndex > currentIndex ? "right" : "left");
      setAnimating(true);
      setTimeout(() => {
        setActiveTab(tab);
        setSelectedTypes([]);
        setMinPrice("");
        setMaxPrice("");
        setBeds("");
        setBaths("");
        setSearchQuery("");
        setShowMore(false);
        setMobileExpanded(false);
        setAnimating(false);
        if (variant === "listing" && tab !== defaultTab) {
          router.push(TAB_ROUTES[tab]);
        }
      }, 150);
    },
    [activeTab, variant, defaultTab, router]
  );

  // ── Build URL ──
  function buildFilterUrl(): string {
    const params = new URLSearchParams();
    if (selectedTypes.length > 0) params.set("type", selectedTypes.join(","));
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (currency !== "GYD") params.set("currency", currency);
    if (beds) params.set("beds", beds);
    if (baths) params.set("baths", baths);
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    const qs = params.toString();
    return `${TAB_ROUTES[activeTab]}${qs ? "?" + qs : ""}`;
  }

  // ── Search handler ──
  const handleSearch = () => {
    const url = buildFilterUrl();
    if (variant === "hero") router.push(url);
    else router.replace(url, { scroll: false });
  };

  // ── Auto-sync for listing variant ──
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (variant !== "listing") return;
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (selectedTypes.length > 0) params.set("type", selectedTypes.join(","));
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (currency !== "GYD") params.set("currency", currency);
      if (beds) params.set("beds", beds);
      if (baths) params.set("baths", baths);
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      const qs = params.toString();
      router.replace(`${TAB_ROUTES[activeTab]}${qs ? "?" + qs : ""}`, { scroll: false });
    }, 300);
    return () => { if (syncTimer.current) clearTimeout(syncTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTypes, minPrice, maxPrice, currency, beds, baths, searchQuery, activeTab, variant]);

  // ── Clear all ──
  const clearFilters = () => {
    setSelectedTypes([]);
    setMinPrice("");
    setMaxPrice("");
    setBeds("");
    setBaths("");
    setSearchQuery("");
    setShowMore(false);
  };

  // ═══════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div
      className={
        isHero
          ? "w-full max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-visible lg:bg-white/95 lg:backdrop-blur-sm"
          : "w-full bg-white border-b shadow-sm"
      }
    >
      {/* ── Tab Bar with animated underline ── */}
      <div
        className={
          isHero
            ? "flex border-b border-gray-200 px-2"
            : "flex border-b border-gray-200 max-w-7xl mx-auto px-4"
        }
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`relative px-3 py-3 text-sm font-semibold transition-all duration-200 lg:px-5 lg:py-3.5 lg:text-base ${
              activeTab === tab.key
                ? "text-green-700 scale-105"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-green-500 rounded-t transition-all duration-300" />
            )}
          </button>
        ))}
      </div>

      {/* ── Filter Area ── */}
      <div
        className={`${isHero ? "p-4 lg:px-6 lg:py-4" : "max-w-7xl mx-auto p-4"} transition-all duration-150 ${
          animating
            ? tabDirection === "right"
              ? "opacity-0 translate-x-4"
              : "opacity-0 -translate-x-4"
            : "opacity-100 translate-x-0"
        }`}
      >

        {/* ── MOBILE LAYOUT (<lg) ── */}
        <div className="lg:hidden space-y-3">

          {/* Always visible: location search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by city, area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => isHero && setMobileExpanded(true)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[44px]"
            />
          </div>

          {/* Collapsed state — hero only, no active filters */}
          {isHero && !mobileExpanded && !hasAnyFilter && (
            <button
              onClick={() => setMobileExpanded(true)}
              className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-500 min-h-[44px] bg-white"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Add filters (type, price, beds)
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
          )}

          {/* Expanded filters */}
          {(!isHero || mobileExpanded || hasAnyFilter) && (
            <>
              {/* Collapse button — hero only */}
              {isHero && mobileExpanded && (
                <button
                  onClick={() => { setMobileExpanded(false); clearFilters(); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg bg-white"
                >
                  <ChevronDown className="w-4 h-4 rotate-180" />
                  Hide filters
                </button>
              )}

              {/* Property Type */}
              <PropertyTypeDropdown
                selected={selectedTypes}
                onChange={setSelectedTypes}
                groups={propertyTypeGroups}
                isHero={isHero}
              />

              {/* Min / Max Price */}
              <div className="grid grid-cols-2 gap-3">
                <PriceDropdown label="Min Price" value={minPrice} onChange={setMinPrice} presets={pricePresets.min} currency={currency} />
                <PriceDropdown label="Max Price" value={maxPrice} onChange={setMaxPrice} presets={pricePresets.max} currency={currency} />
              </div>

              {/* Currency Toggle */}
              <div className="flex justify-center">
                <div className="inline-flex items-center bg-gray-100 rounded-full p-0.5">
                  <button
                    onClick={() => { setCurrency("GYD"); setMinPrice(""); setMaxPrice(""); }}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${currency === "GYD" ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >GYD</button>
                  <button
                    onClick={() => { setCurrency("USD"); setMinPrice(""); setMaxPrice(""); }}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${currency === "USD" ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >USD</button>
                </div>
              </div>

              {/* Beds / Baths — buy and rent only */}
              {showBedBath && (
                <div className="grid grid-cols-2 gap-3">
                  <select value={beds} onChange={(e) => setBeds(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg text-sm min-h-[44px] focus:ring-2 focus:ring-green-500 focus:border-green-500 ${beds ? "border-green-500 text-green-700 bg-green-50" : "border-gray-200 text-gray-700 bg-white"}`}>
                    <option value="">Bedrooms</option>
                    <option value="1">1+ Bed</option>
                    <option value="2">2+ Beds</option>
                    <option value="3">3+ Beds</option>
                    <option value="4">4+ Beds</option>
                    <option value="5">5+ Beds</option>
                  </select>
                  <select value={baths} onChange={(e) => setBaths(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg text-sm min-h-[44px] focus:ring-2 focus:ring-green-500 focus:border-green-500 ${baths ? "border-green-500 text-green-700 bg-green-50" : "border-gray-200 text-gray-700 bg-white"}`}>
                    <option value="">Bathrooms</option>
                    <option value="1">1+ Bath</option>
                    <option value="2">2+ Baths</option>
                    <option value="3">3+ Baths</option>
                    <option value="4">4+ Baths</option>
                  </select>
                </div>
              )}

              {/* More Filters */}
              <button
                onClick={() => setShowMore(!showMore)}
                className={`w-full flex items-center justify-between px-4 py-3 border rounded-lg text-sm min-h-[44px] transition-colors ${
                  showMore || moreFilterCount > 0 ? "border-green-500 text-green-700 bg-green-50" : "border-gray-200 text-gray-700 bg-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>More Filters</span>
                  {moreFilterCount > 0 && (
                    <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{moreFilterCount}</span>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showMore ? "rotate-180" : ""}`} />
              </button>

              {showMore && (
                <div className="border border-gray-200 rounded-lg p-3 space-y-3 bg-gray-50">
                  <p className="text-xs text-gray-500">More filters coming soon: parking spaces, pool, garden, security, etc.</p>
                </div>
              )}

              {hasAnyFilter && (
                <button onClick={clearFilters} className="w-full text-sm text-red-500 hover:text-red-600 py-2">
                  Clear Filters
                </button>
              )}
            </>
          )}

          {/* Search button — always visible */}
          <button
            onClick={handleSearch}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[48px]"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>

        {/* ── DESKTOP LAYOUT (lg+) ── */}
        <div className="hidden lg:block space-y-2">
          {isHero ? (
            <>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by city, neighborhood, or area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder:text-gray-400"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="w-40">
                  <PropertyTypeDropdown selected={selectedTypes} onChange={setSelectedTypes} groups={propertyTypeGroups} isHero={isHero} />
                </div>
                <div className="w-32">
                  <PriceDropdown label="Min Price" value={minPrice} onChange={setMinPrice} presets={pricePresets.min} currency={currency} pillShape />
                </div>
                <div className="w-32">
                  <PriceDropdown label="Max Price" value={maxPrice} onChange={setMaxPrice} presets={pricePresets.max} currency={currency} pillShape />
                </div>
                <div className="inline-flex items-center bg-gray-100 rounded-full p-0.5">
                  <button onClick={() => { setCurrency("GYD"); setMinPrice(""); setMaxPrice(""); }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${currency === "GYD" ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>GYD</button>
                  <button onClick={() => { setCurrency("USD"); setMinPrice(""); setMaxPrice(""); }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${currency === "USD" ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>USD</button>
                </div>
                {showBedBath && (
                  <>
                    <select value={beds} onChange={(e) => setBeds(e.target.value)}
                      className={`px-3 py-2.5 border rounded-full text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${beds ? "border-green-500 text-green-700" : "border-gray-200 text-gray-700"}`}>
                      <option value="">Beds</option>
                      <option value="1">1+ Bed</option>
                      <option value="2">2+ Beds</option>
                      <option value="3">3+ Beds</option>
                      <option value="4">4+ Beds</option>
                      <option value="5">5+ Beds</option>
                    </select>
                    <select value={baths} onChange={(e) => setBaths(e.target.value)}
                      className={`px-3 py-2.5 border rounded-full text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${baths ? "border-green-500 text-green-700" : "border-gray-200 text-gray-700"}`}>
                      <option value="">Baths</option>
                      <option value="1">1+ Bath</option>
                      <option value="2">2+ Baths</option>
                      <option value="3">3+ Baths</option>
                      <option value="4">4+ Baths</option>
                    </select>
                  </>
                )}
                <button onClick={() => setShowMore(!showMore)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 border rounded-full text-sm font-medium transition-colors ${
                    showMore || moreFilterCount > 0 ? "border-green-500 text-green-700 bg-green-50" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}>
                  <SlidersHorizontal className="w-4 h-4" />
                  More
                  {moreFilterCount > 0 && (
                    <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{moreFilterCount}</span>
                  )}
                </button>
                <div className="flex-1" />
                {hasAnyFilter && (
                  <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 font-medium">Clear</button>
                )}
                <button onClick={handleSearch}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-10 rounded-full transition-colors flex items-center gap-2 text-base shadow-md">
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3">
                <div className="flex-1 relative min-w-[180px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="text" placeholder="Search by city, area..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                </div>
                <div className="w-52">
                  <PropertyTypeDropdown selected={selectedTypes} onChange={setSelectedTypes} groups={propertyTypeGroups} isHero={isHero} />
                </div>
                <div className="w-40">
                  <PriceDropdown label="Min Price" value={minPrice} onChange={setMinPrice} presets={pricePresets.min} currency={currency} />
                </div>
                <div className="w-40">
                  <PriceDropdown label="Max Price" value={maxPrice} onChange={setMaxPrice} presets={pricePresets.max} currency={currency} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center bg-gray-100 rounded-full p-0.5">
                  <button onClick={() => { setCurrency("GYD"); setMinPrice(""); setMaxPrice(""); }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${currency === "GYD" ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>GYD</button>
                  <button onClick={() => { setCurrency("USD"); setMinPrice(""); setMaxPrice(""); }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${currency === "USD" ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>USD</button>
                </div>
                {showBedBath && (
                  <>
                    <select value={beds} onChange={(e) => setBeds(e.target.value)}
                      className={`px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${beds ? "border-green-500 text-green-700" : "border-gray-200 text-gray-700"}`}>
                      <option value="">Bedrooms</option>
                      <option value="1">1+ Bed</option>
                      <option value="2">2+ Beds</option>
                      <option value="3">3+ Beds</option>
                      <option value="4">4+ Beds</option>
                      <option value="5">5+ Beds</option>
                    </select>
                    <select value={baths} onChange={(e) => setBaths(e.target.value)}
                      className={`px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${baths ? "border-green-500 text-green-700" : "border-gray-200 text-gray-700"}`}>
                      <option value="">Bathrooms</option>
                      <option value="1">1+ Bath</option>
                      <option value="2">2+ Baths</option>
                      <option value="3">3+ Baths</option>
                      <option value="4">4+ Baths</option>
                    </select>
                  </>
                )}
                <button onClick={() => setShowMore(!showMore)}
                  className={`flex items-center gap-1.5 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                    showMore || moreFilterCount > 0 ? "border-green-500 text-green-700 bg-green-50" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}>
                  <SlidersHorizontal className="w-4 h-4" />
                  More
                  {moreFilterCount > 0 && (
                    <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{moreFilterCount}</span>
                  )}
                </button>
                <div className="flex-1" />
                {hasAnyFilter && (
                  <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 font-medium">Clear Filters</button>
                )}
                <button onClick={handleSearch}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </>
          )}
          {showMore && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <p className="text-sm text-gray-500">More filters coming soon: parking spaces, pool, garden, security, etc.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
