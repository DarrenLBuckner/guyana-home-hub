'use client';
import { useCountryTheme } from './CountryThemeProvider';

export default function Navbar() {
  const { theme, country } = useCountryTheme();
  
  return (
    <nav style={{ backgroundColor: theme.colors.primary }}>
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-white text-2xl font-bold">
          {theme.name}
        </h1>
        {/* Rest of your navbar content */}
      </div>
    </nav>
  );
}
