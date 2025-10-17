This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🎨 Country Theme System

This project uses a multi-country theme system that automatically adjusts branding and styling based on the target country (Jamaica vs Guyana).

### Using Themes in Components

Components that display country-specific content must use the theme hook:

```typescript
'use client';
import { useCountryTheme } from '@/components/CountryThemeProvider';

export default function MyComponent() {
  const { theme, country } = useCountryTheme();
  return <h1 style={{ color: theme.colors.primary }}>{theme.name}</h1>;
}
```

### Available Theme Properties
- `theme.name` - "Jamaica Home Hub" or "Guyana Home Hub"
- `theme.colors.primary` - Main brand color
- `theme.colors.secondary` - Secondary brand color  
- `theme.currency` - "JMD" or "GYD"
- `country` - Current country code ("JM" or "GY")

### Quick Reference
- **Jamaica**: Green (#10b981) / Gold (#fbbf24)
- **Guyana**: Blue (#3b82f6) / Green (#10b981)

### Development Commands
```bash
# Check theme usage for errors
npm run check-theme

# Run development server
npm run dev

# Build for production
npm run build
```

### Documentation
See `docs/patterns/theme-usage.md` for complete usage patterns and examples.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
