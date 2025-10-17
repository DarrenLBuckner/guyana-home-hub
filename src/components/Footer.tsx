'use client';
import { useCountryTheme } from './CountryThemeProvider';

export default function Footer() {
  const { theme, country } = useCountryTheme();
  
  return (
    <footer style={{ backgroundColor: theme.colors.primary }}>
      <div className="container mx-auto px-4 py-8">
        <p className="text-white text-center">
          © 2025 {theme.name}. All rights reserved.
        </p>
        {/* Rest of your footer content */}
      </div>
    </footer>
  );
}
