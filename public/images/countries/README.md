# Country-Specific Hero Images

This directory contains country-specific hero images for mobile rotation.

## Structure
```
/public/images/countries/
├── jamaica/
│   ├── hero-mobile-1.jpg  (1080x1600 portrait)
│   ├── hero-mobile-2.jpg  (1080x1600 portrait)
│   └── hero-mobile-3.jpg  (1080x1600 portrait - optional)
├── guyana/
├── barbados/
├── rwanda/
├── ghana/
├── namibia/
├── south-africa/
├── kenya/
├── dominican-republic/
├── trinidad/
```

## Usage
- Each country can have 1-3 mobile hero images that rotate every 8 seconds
- Images should be 1080x1600 (portrait orientation) for mobile
- Desktop images remain the same across all countries
- If country-specific images don't exist, falls back to default `/hero/hero-mobile.jpg`

## Adding New Countries
1. Create new folder: `/public/images/countries/[country-name]/`
2. Add mobile images: `hero-mobile-1.jpg`, `hero-mobile-2.jpg`, etc.
3. Update Hero component's country mapping if needed

## Image Guidelines
- Use high-quality images featuring local people and architecture
- Ensure images represent the target demographic and culture
- Optimize for web (keep file sizes reasonable)
- Test on mobile devices for proper display