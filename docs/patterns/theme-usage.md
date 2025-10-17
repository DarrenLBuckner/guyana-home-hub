# Country Theme Usage Pattern

## For Client Components That Need Theme

```typescript
'use client';
import { useCountryTheme } from '@/components/CountryThemeProvider';

export default function ComponentName() {
  const { theme, country } = useCountryTheme();
  
  return (
    <div>
      <h1>{theme.name}</h1>
      {/* Use theme.colors, theme.currency, country, etc. */}
    </div>
  );
}
```

## Available Theme Properties

- `theme.name` - "Jamaica Home Hub" or "Guyana Home Hub"
- `theme.code` - "JM" or "GY"
- `theme.currency` - "JMD" or "GYD"
- `theme.colors.primary` - Main brand color
- `theme.colors.secondary` - Secondary brand color
- `theme.colors.accent` - Accent color
- `country` - Current country code ("JM" or "GY")

## Common Mistakes to Avoid

❌ `const theme = useCountryTheme;` (missing parentheses)
✅ `const { theme } = useCountryTheme();`

❌ `return {theme}` (rendering object)
✅ `return <div>{theme.name}</div>` (rendering string)

❌ Using in server component without 'use client'
✅ Add 'use client' at top of file

## Real Examples

### Navbar Component
```typescript
'use client';
import { useCountryTheme } from '@/components/CountryThemeProvider';

export default function Navbar() {
  const { theme, country } = useCountryTheme();
  
  return (
    <nav style={{ backgroundColor: theme.colors.primary }}>
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-white text-2xl font-bold">
          {theme.name}
        </h1>
      </div>
    </nav>
  );
}
```

### Footer Component
```typescript
'use client';
import { useCountryTheme } from '@/components/CountryThemeProvider';

export default function Footer() {
  const { theme, country } = useCountryTheme();
  
  return (
    <footer style={{ backgroundColor: theme.colors.primary }}>
      <div className="container mx-auto px-4 py-8">
        <p className="text-white text-center">
          © 2025 {theme.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
```

## Debugging Tips

If you see "d is not a function" error:
1. Check if you're rendering `{theme}` instead of `{theme.name}`
2. Verify you're using `const { theme } = useCountryTheme()` not `const theme = useCountryTheme`
3. Make sure component has `'use client'` directive
4. Run the theme checker script: `./scripts/check-theme-usage.sh`