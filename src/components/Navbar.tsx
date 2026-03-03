"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Heart, UserCircle, ChevronDown, Mail, Building2, BookOpen, Newspaper, Calculator, DollarSign, ShieldCheck, ShieldAlert, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useFavorites } from "@/hooks/useFavorites";
import { useCountryTheme } from "@/components/CountryThemeProvider";

/* ================================================================
   NAV LINK DATA
   ================================================================ */

const NAV_LINKS = [
  { href: "/properties/buy", label: "Buy" },
  { href: "/properties/rent", label: "Rent" },
  { href: "/properties/commercial", label: "Commercial" },
  { href: "/properties/developments", label: "Developments" },
] as const;

const SERVICES_MAIN = [
  {
    title: "Local Services",
    description: "Find lawyers, surveyors and professionals in Guyana",
    href: "/business-directory",
    icon: Building2,
  },
  {
    title: "Property Guides",
    description: "Expert advice for buyers and investors",
    href: "/guides",
    icon: BookOpen,
  },
  {
    title: "Blog & News",
    description: "Latest market updates and insights",
    href: "/blog",
    icon: Newspaper,
  },
];

const SERVICES_TOOLS = [
  { title: "Mortgage Calculator", href: "/mortgage-calculator", icon: Calculator },
  { title: "Currency Converter", href: "/tools/currency-converter", icon: DollarSign },
];

const SERVICES_SAFETY = [
  { title: "Safety Tips", href: "/safety-tips", icon: ShieldCheck },
  { title: "Anti-Scam Guide", href: "/anti-scam-guide", icon: ShieldAlert },
];

const SERVICES_ROUTES = [
  "/business-directory", "/guides", "/blog",
  "/mortgage-calculator", "/tools/currency-converter",
  "/safety-tips", "/anti-scam-guide",
];

/* ================================================================
   COMPONENT
   ================================================================ */

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const { favoritesCount } = useFavorites();
  const { theme } = useCountryTheme();

  const servicesOpenRef = useRef<ReturnType<typeof setTimeout>>();
  const servicesCloseRef = useRef<ReturnType<typeof setTimeout>>();
  const accountRef = useRef<HTMLDivElement>(null);

  /* ---- Auth ---- */

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
      setLoading(false);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );
    return () => subscription.unsubscribe();
  }, [supabase]);

  /* ---- Body scroll lock (mobile) ---- */

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  /* ---- Click-outside for account dropdown ---- */

  useEffect(() => {
    if (!accountOpen) return;
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [accountOpen]);

  /* ---- Handlers ---- */

  const closeMenu = () => setMenuOpen(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
    setAccountOpen(false);
    router.push("/");
  };

  const handleOAuthSignIn = async (provider: "google" | "facebook") => {
    setAccountOpen(false);
    setMenuOpen(false);
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handleServicesEnter = () => {
    clearTimeout(servicesCloseRef.current);
    servicesOpenRef.current = setTimeout(() => setServicesOpen(true), 150);
  };

  const handleServicesLeave = () => {
    clearTimeout(servicesOpenRef.current);
    servicesCloseRef.current = setTimeout(() => setServicesOpen(false), 100);
  };

  /* ---- Helpers ---- */

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const isServicesActive = SERVICES_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );

  /* ---- Auth buttons (shared between desktop dropdown & mobile drawer) ---- */

  const renderAuthButtons = (onAction?: () => void) => (
    <div className="space-y-2">
      <button
        onClick={() => { onAction?.(); handleOAuthSignIn("google"); }}
        className="w-full flex items-center px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
      >
        <svg className="w-5 h-5 mr-3 flex-shrink-0" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <button
        onClick={() => { onAction?.(); handleOAuthSignIn("facebook"); }}
        className="w-full flex items-center px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-blue-50 transition-colors text-sm font-medium text-gray-700"
      >
        <svg className="w-5 h-5 mr-3 flex-shrink-0" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
        </svg>
        Continue with Facebook
      </button>

      <Link
        href="/signin"
        onClick={() => { onAction?.(); setAccountOpen(false); closeMenu(); }}
        className="w-full flex items-center px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
      >
        <Mail className="w-5 h-5 mr-3 flex-shrink-0 text-gray-500" />
        Continue with Email
      </Link>
    </div>
  );

  /* ================================================================
     RENDER
     ================================================================ */

  return (
    <>
      {/* ==================== HEADER ==================== */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

          {/* ---- Logo ---- */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <span className="text-2xl font-bold text-green-600">{theme.name}</span>
          </Link>

          {/* ---- Desktop Nav Links ---- */}
          <div className="hidden md:flex items-center h-full ml-8 space-x-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center h-full px-3 text-sm font-medium transition-colors group ${
                  isActive(href) ? "text-green-600" : "text-gray-700 hover:text-green-600"
                }`}
              >
                {label}
                <span
                  className={`absolute bottom-0 left-3 right-3 h-0.5 bg-green-600 transition-transform duration-200 origin-center ${
                    isActive(href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}

            {/* ---- Services Dropdown ---- */}
            <div
              className="relative flex items-center h-full"
              onMouseEnter={handleServicesEnter}
              onMouseLeave={handleServicesLeave}
            >
              <button
                className={`relative flex items-center h-full px-3 text-sm font-medium transition-colors group ${
                  isServicesActive || servicesOpen ? "text-green-600" : "text-gray-700 hover:text-green-600"
                }`}
              >
                Services
                <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} />
                <span
                  className={`absolute bottom-0 left-3 right-3 h-0.5 bg-green-600 transition-transform duration-200 origin-center ${
                    isServicesActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </button>

              {/* Dropdown Panel */}
              <div className={`absolute top-full left-0 pt-2 ${servicesOpen ? "" : "pointer-events-none"}`}>
                <div
                  className={`bg-white rounded-xl shadow-xl border border-gray-100 p-6 min-w-[340px] transition-all duration-200 ease-out ${
                    servicesOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                  }`}
                >
                  {/* Main items */}
                  <div className="space-y-1">
                    {SERVICES_MAIN.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-start gap-3 px-3 py-3 rounded-lg border-l-2 border-transparent hover:border-l-green-600 hover:bg-green-50/60 transition-all duration-150"
                      >
                        <item.icon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="h-px bg-gray-100 my-3" />

                  {/* Tools */}
                  <div className="mb-1">
                    <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Tools</div>
                    <div className="space-y-0.5">
                      {SERVICES_TOOLS.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg border-l-2 border-transparent hover:border-l-green-600 hover:bg-green-50/60 transition-all duration-150"
                        >
                          <item.icon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{item.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 my-3" />

                  {/* Safety */}
                  <div>
                    <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Safety &amp; Trust</div>
                    <div className="space-y-0.5">
                      {SERVICES_SAFETY.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg border-l-2 border-transparent hover:border-l-green-600 hover:bg-green-50/60 transition-all duration-150"
                        >
                          <item.icon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{item.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---- Desktop Right Side ---- */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Favorites (signed-in only) */}
            {!loading && user && (
              <Link
                href="/favorites"
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="My Favorites"
              >
                <Heart className="h-5 w-5 text-gray-600" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {favoritesCount > 9 ? "9+" : favoritesCount}
                  </span>
                )}
              </Link>
            )}

            {/* Account Icon */}
            <div ref={accountRef} className="relative">
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Account"
              >
                {!loading && user ? (
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-semibold">
                    {user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                ) : (
                  <UserCircle className="w-8 h-8 text-gray-400" />
                )}
              </button>

              {/* Account Dropdown */}
              {accountOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-5 z-10 transition-all duration-200">
                  {!loading && user ? (
                    <>
                      <p className="text-sm font-semibold text-gray-900 mb-0.5">Welcome back</p>
                      <p className="text-xs text-gray-500 mb-4 truncate">{user.email}</p>
                      <div className="space-y-1">
                        <Link
                          href="/favorites"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center w-full px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Heart className="w-4 h-4 mr-2.5 text-gray-400" />
                          My Favorites
                          {favoritesCount > 0 && (
                            <span className="ml-auto text-xs text-gray-400">{favoritesCount}</span>
                          )}
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <ArrowRight className="w-4 h-4 mr-2.5 text-gray-400" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-base font-semibold text-gray-900 mb-1">Welcome to {theme.name}</p>
                      <p className="text-xs text-gray-500 mb-4">Save favorites, get alerts, and track your listings</p>
                      {renderAuthButtons()}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* CTA */}
            <Link
              href="/advertise"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold text-sm tracking-wide transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ml-1"
            >
              List Your Property
            </Link>
          </div>

          {/* ---- Mobile Hamburger ---- */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            aria-label="Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </header>

      {/* ==================== MOBILE DRAWER ==================== */}
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${
          menuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMenu}
        />

        {/* Drawer Panel */}
        <div
          className={`absolute inset-y-0 right-0 w-full bg-white overflow-y-auto transform transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
            <Link href="/" onClick={closeMenu} className="text-xl font-bold text-green-600">
              {theme.name}
            </Link>
            <button
              onClick={closeMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          <div className="px-6 py-6 space-y-6">
            {/* PROPERTIES */}
            <div>
              <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">Properties</div>
              <div className="space-y-0">
                <Link href="/properties/buy" onClick={closeMenu} className="flex items-center py-3 text-lg font-medium text-gray-800 hover:text-green-600 transition-colors">
                  Buy Properties
                </Link>
                <Link href="/properties/rent" onClick={closeMenu} className="flex items-center py-3 text-lg font-medium text-gray-800 hover:text-green-600 transition-colors">
                  Rent Properties
                </Link>
                <Link href="/properties/commercial" onClick={closeMenu} className="flex items-center py-3 text-lg font-medium text-gray-800 hover:text-green-600 transition-colors">
                  Commercial Properties
                </Link>
                <Link href="/properties/developments" onClick={closeMenu} className="flex items-center py-3 text-lg font-medium text-gray-800 hover:text-green-600 transition-colors">
                  Developments
                </Link>
              </div>
            </div>

            {/* SERVICES & TOOLS */}
            <div>
              <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">Services &amp; Tools</div>
              <div className="space-y-0">
                <Link href="/business-directory" onClick={closeMenu} className="flex items-center py-3 text-lg font-medium text-gray-800 hover:text-green-600 transition-colors">
                  Local Services
                </Link>
                <Link href="/guides" onClick={closeMenu} className="flex items-center py-3 text-lg font-medium text-gray-800 hover:text-green-600 transition-colors">
                  Property Guides
                </Link>
                <Link href="/blog" onClick={closeMenu} className="flex items-center py-3 text-lg font-medium text-gray-800 hover:text-green-600 transition-colors">
                  Blog &amp; News
                </Link>
                <Link href="/mortgage-calculator" onClick={closeMenu} className="flex items-center py-3 text-base text-gray-600 hover:text-green-600 transition-colors">
                  Mortgage Calculator
                </Link>
                <Link href="/tools/currency-converter" onClick={closeMenu} className="flex items-center py-3 text-base text-gray-600 hover:text-green-600 transition-colors">
                  Currency Converter
                </Link>
              </div>
            </div>

            {/* LIST YOUR PROPERTY CTA */}
            <Link
              href="/advertise"
              onClick={closeMenu}
              className="block bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-lg">List Your Property</div>
                  <div className="text-green-100 text-sm mt-0.5">Sell or rent your property</div>
                </div>
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                  Free
                </span>
              </div>
            </Link>

            {/* BOTTOM LINKS */}
            <div>
              <div className="space-y-0">
                <Link href="/safety-tips" onClick={closeMenu} className="flex items-center py-3 text-base text-gray-600 hover:text-green-600 transition-colors">
                  Safety Tips
                </Link>
                <Link href="/contact" onClick={closeMenu} className="flex items-center py-3 text-base text-gray-600 hover:text-green-600 transition-colors">
                  Contact Us
                </Link>
                <a
                  href="https://portalhomehub.com/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="flex items-center py-3 text-base text-gray-600 hover:text-green-600 transition-colors"
                >
                  Agent Portal
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 text-gray-400" />
                </a>
              </div>
            </div>

            {/* AUTH SECTION */}
            <div className="border-t border-gray-100 pt-6">
              {!loading && user ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  <Link
                    href="/favorites"
                    onClick={closeMenu}
                    className="flex items-center py-3 text-base font-medium text-gray-800 hover:text-green-600 transition-colors"
                  >
                    <Heart className="w-5 h-5 mr-2.5" />
                    My Favorites
                    {favoritesCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {favoritesCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center py-3 text-base text-gray-600 hover:text-green-600 transition-colors w-full"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Welcome to {theme.name}</p>
                  <p className="text-xs text-gray-400 mb-4">Save favorites, get alerts, and track your listings</p>
                  {renderAuthButtons(closeMenu)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
