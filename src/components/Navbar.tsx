// src/components/layout/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/hooks/useFavorites";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();
  const { favoritesCount } = useFavorites();

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
            Guyana Home Hub
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
          <Link
            href="/properties/developments"
            className="hover:text-green-600"
          >
            Developments
          </Link>
          {/* [CHH-SYS] Admin Login link */}
          {/* Admin login link removed for production */}
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
          <Link
            href="/advertise"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold"
          >
            Advertise
          </Link>
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
        <div className="md:hidden bg-white px-4 pb-4 space-y-2">
          <Link
            href="/"
            className="block text-green-700 hover:text-green-800"
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            href="/properties/buy"
            className="block text-green-700 hover:text-green-800"
            onClick={closeMenu}
          >
            Buy
          </Link>
          <Link
            href="/properties/rent"
            className="block text-green-700 hover:text-green-800"
            onClick={closeMenu}
          >
            Rent
          </Link>
          <Link
            href="/properties/developments"
            className="block text-green-700 hover:text-green-800"
            onClick={closeMenu}
          >
            Developments
          </Link>

          {/* Mobile Auth Section */}
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : user ? (
            <div className="pt-2 border-t border-gray-200 mt-2">
              <div className="text-sm text-gray-600 mb-2">
                Welcome, {user.email?.split('@')[0]}
              </div>
              <Link
                href="/favorites"
                className="block text-green-700 hover:text-green-800 flex items-center mb-2"
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
                className="block text-green-700 hover:text-green-800"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/signin"
              className="block text-green-700 hover:text-green-800"
              onClick={closeMenu}
            >
              Sign In
            </Link>
          )}
          
          {/* Agent Section in Mobile */}
          <div className="pt-2 border-t border-gray-200 mt-2">
            <div className="text-xs font-semibold text-green-700 mb-1">
              For Agents
            </div>
            <Link
              href="https://portalhomehub.com/register"
              className="block text-sm text-green-700 hover:text-green-800 pl-2"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              Agent Registration
            </Link>
            <a
              href="https://portalhomehub.com/login"
              className="block text-sm text-gray-500 hover:text-green-800 pl-2 mt-1"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              Agent Login
            </a>
          </div>
          
          <Link
            href="/contact"
            className="block text-green-700 hover:text-green-800"
            onClick={closeMenu}
          >
            Contact Us
          </Link>
          <Link href="/advertise" className="block" onClick={closeMenu}>
            <button className="w-full bg-green-600 text-white py-2 rounded-md">
              Advertise
            </button>
          </Link>
          {/* [CHH-SYS] Admin Login link for mobile */}
          {/* Admin login link removed for production (mobile) */}
        </div>
      )}
    </header>
  );
}
