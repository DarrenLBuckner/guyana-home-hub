// src/components/layout/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Heart, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/hooks/useFavorites";
import { useCountryTheme } from "@/components/CountryThemeProvider";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [commercialDropdownOpen, setCommercialDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();
  const { favoritesCount } = useFavorites();
  const { theme } = useCountryTheme();

  // Check authentication status
  useEffect(() => {
    const getUser = async () => {
      console.log('Navbar: Checking user authentication...')
      const { data, error } = await supabase.auth.getUser();
      console.log('Navbar: User data:', data?.user ? 'User found' : 'No user', error)
      if (data?.user) {
        setUser(data.user);
        console.log('Navbar: User set:', data.user.email)
      }
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Navbar: Auth state changed:', event, session?.user ? 'User present' : 'No user')
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
    closeMenu();
  };

  // Function to close mobile menu when a link is clicked
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-green-600">
            {theme.name}
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="hover:text-green-600">
            Home
          </Link>
          <Link href="/properties/buy" className="hover:text-green-600">
            Buy
          </Link>
          <Link href="/properties/rent" className="hover:text-green-600">
            Rent
          </Link>
          {/* Commercial Dropdown */}
          <div 
            className="relative"
            onMouseLeave={() => setCommercialDropdownOpen(false)}
          >
            <button
              onClick={() => setCommercialDropdownOpen(!commercialDropdownOpen)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setCommercialDropdownOpen(!commercialDropdownOpen);
                }
                if (e.key === 'Escape') {
                  setCommercialDropdownOpen(false);
                }
              }}
              aria-expanded={commercialDropdownOpen}
              aria-haspopup="true"
              aria-label="Commercial properties menu"
              className="flex items-center hover:text-green-600"
            >
              Commercial
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            {commercialDropdownOpen && (
              <div 
                className="absolute left-0 top-full mt-2 bg-white rounded-md shadow-lg border min-w-[150px] z-50"
                role="menu"
                aria-label="Commercial properties submenu"
              >
                <Link
                  href="/properties/commercial/lease"
                  className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 focus:bg-green-50 focus:text-green-600 focus:outline-none"
                  onClick={() => setCommercialDropdownOpen(false)}
                  role="menuitem"
                >
                  For Lease
                </Link>
                <Link
                  href="/properties/commercial/sale"
                  className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 focus:bg-green-50 focus:text-green-600 focus:outline-none"
                  onClick={() => setCommercialDropdownOpen(false)}
                  role="menuitem"
                >
                  For Sale
                </Link>
              </div>
            )}
          </div>
          <Link href="/business-directory" className="hover:text-green-600">
            Business Directory
          </Link>
        </div>



        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <Link 
                href="/favorites" 
                className="flex items-center hover:text-green-600 relative"
                title="My Favorites"
              >
                <Heart className="h-5 w-5" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favoritesCount > 9 ? '9+' : favoritesCount}
                  </span>
                )}
              </Link>
              <span className="text-sm text-gray-600">
                Welcome, {user.email?.split('@')[0]}
              </span>
              <button 
                onClick={handleSignOut}
                className="hover:text-green-600"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/signin" className="hover:text-green-600">
              Sign In
            </Link>
          )}
          <a
            href="https://portalhomehub.com/register/select-country"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold"
          >
            List Your Property
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-700"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 pb-4">
          {/* === PRIMARY ACTIONS (Most Important) === */}
          <div className="space-y-2 py-3">
            <Link
              href="/properties/buy"
              className="block text-blue-600 hover:text-blue-700 text-lg font-bold py-3 px-4"
              onClick={closeMenu}
            >
              🏡 Buy Properties
            </Link>
            <Link
              href="/properties/rent"
              className="block text-blue-600 hover:text-blue-700 text-lg font-bold py-3 px-4"
              onClick={closeMenu}
            >
              🏠 Rent Properties
            </Link>
            
            {/* Commercial Properties Mobile */}
            <div className="space-y-1 ml-4">
              <Link
                href="/properties/commercial/lease"
                className="block text-green-600 hover:text-green-700 text-lg font-bold py-2 px-4"
                onClick={closeMenu}
              >
                🏢 Commercial Lease
              </Link>
              <Link
                href="/properties/commercial/sale"
                className="block text-green-600 hover:text-green-700 text-lg font-bold py-2 px-4"
                onClick={closeMenu}
              >
                🏢 Commercial Sale
              </Link>
            </div>
          </div>
          
          {/* === VISUAL DIVIDER LINE === */}
          <div className="h-px bg-gray-200 my-3"></div>
          
          {/* === SECONDARY ACTIONS === */}
          <div className="space-y-3">
            {/* Emphasized CTA for List Property */}
            <Link
              href="https://portalhomehub.com/register/select-country"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-5 rounded-lg text-center shadow-md my-2"
              onClick={closeMenu}
            >
              📝 List Your Property Here
              <div className="text-sm font-normal opacity-90 mt-1">Sell or Rent Your Property</div>
            </Link>
            
            <Link
              href="/business-directory"
              className="block text-gray-700 hover:text-green-600 py-2 px-4"
              onClick={closeMenu}
            >
              🏢 Business Directory
              <div className="text-sm text-gray-500">Find Local Businesses</div>
            </Link>
          </div>
          
          {/* === VISUAL DIVIDER LINE === */}
          <div className="h-px bg-gray-200 my-3"></div>

          {/* === USER/ADMIN ACTIONS (Bottom) === */}
          <div className="space-y-2">
            <Link
              href="https://portalhomehub.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-500 hover:text-green-600 text-sm py-2 px-4"
              onClick={closeMenu}
            >
              👤 Agent Portal
            </Link>
          </div>

          {/* Mobile Auth Section */}
          {loading ? (
            <div className="text-gray-500 text-center py-2">Loading...</div>
          ) : user ? (
            <div className="pt-3 border-t border-gray-200 mt-3">
              <div className="text-sm text-gray-600 mb-2 px-4">
                Welcome, {user.email?.split('@')[0]}
              </div>
              <Link
                href="/favorites"
                className="block text-green-700 hover:text-green-800 flex items-center mb-2 px-4"
                onClick={closeMenu}
              >
                <Heart className="h-4 w-4 mr-2" />
                My Favorites
                {favoritesCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </Link>
              <button 
                onClick={handleSignOut}
                className="block text-green-700 hover:text-green-800 px-4"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-gray-200 mt-3">
              <Link
                href="/signin"
                className="block text-green-700 hover:text-green-800 px-4"
                onClick={closeMenu}
              >
                Sign In
              </Link>
            </div>
          )}
          {/* [CHH-SYS] Admin Login link for mobile */}
          {/* Admin login link removed for production (mobile) */}
        </div>
      )}
    </header>
  );
}
