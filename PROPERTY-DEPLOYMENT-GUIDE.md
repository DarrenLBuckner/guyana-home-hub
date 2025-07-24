# Property Browsing System Deployment Guide

## Overview
This guide will help you deploy the property browsing functionality with comprehensive sample data covering all major regions of Guyana.

## SQL Scripts Execution Order

⚠️ **IMPORTANT**: These scripts MUST be executed in the correct order to avoid dependency errors.

### Step 1: Comprehensive Schema Setup
**File**: `step1-comprehensive-schema-setup.sql`
**Purpose**: Adds ALL needed columns, indexes, and policies in one go
**Execute First**: This script creates the complete column structure

**Columns Added**:
- `region` - For Guyana regional searches
- `property_type` - house, apartment, villa, land, etc.
- `price_type` - sale or rent
- `bedrooms`, `bathrooms` - Property details
- `lot_size`, `home_size` - Size information
- `features` - Array of property features
- `images` - Array of image URLs
- `hero_index`, `views`, `inquiries` - Display and analytics
- `updated_at` - Timestamp tracking

### Step 2: Sample Properties Data
**File**: `step2-sample-properties-data.sql`
**Purpose**: Populates the database with 10 realistic Guyana properties
**Execute Second**: After the region column exists

**Sample Properties Include**:
- Modern apartment in Georgetown (Region 4) - GYD 120,000/month
- Luxury beachfront villa in Essequibo (Region 2) - GYD 48,000,000
- Family home in Linden (Region 10) - GYD 25,000,000
- Development land in Berbice (Region 6) - GYD 8,000,000
- And 6 more diverse properties across Guyana

### Step 3: Property Search Functions
**File**: `step3-property-search-functions.sql`
**Purpose**: Creates database functions for property filtering and search
**Execute Third**: After sample data is loaded

**Functions Created**:
- `get_properties_with_filters()` - Main search function
- `get_available_regions()` - For region dropdown
- `get_available_locations()` - For location dropdown
- `get_property_type_counts()` - For analytics

## How to Deploy

### Option 1: Supabase Dashboard
1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Copy and paste each script in order:
   - First: `step1-comprehensive-schema-setup.sql`
   - Second: `step2-sample-properties-data.sql`
   - Third: `step3-property-search-functions.sql`
4. Click "Run" for each script

### Option 2: Command Line (if you have psql)
```bash
# Connect to your Supabase database
psql "your-supabase-connection-string"

# Execute in order
\i step1-comprehensive-schema-setup.sql
\i step2-sample-properties-data.sql
\i step3-property-search-functions.sql
```

## What You'll Get After Deployment

### Regional Coverage
- **Region 2 (Pomeroon-Supenaam)**: Essequibo Coast, Anna Regina
- **Region 4 (Demerara-Mahaica)**: Georgetown (multiple properties)
- **Region 6 (East Berbice-Corentyne)**: New Amsterdam, Rose Hall
- **Region 10 (Upper Demerara-Berbice)**: Linden

### Property Types
- Apartments and Condos
- Houses and Townhouses
- Villas and Luxury Properties
- Development and Agricultural Land

### Price Ranges
- **Rentals**: GYD 120,000 - 220,000/month
- **Sales**: GYD 5,000,000 - 48,000,000

### Demo Agent
- **Maria Ramdeen** (demo.agent@guyanahomehub.com)
- All properties listed under this verified agent

## Next Steps After Deployment

1. **Test the Functions**:
   ```sql
   -- Test property search
   SELECT * FROM get_properties_with_filters('sale', NULL, 'Region 4', NULL, 10000000, 50000000);
   
   -- Test region dropdown
   SELECT * FROM get_available_regions();
   ```

2. **Build the Frontend**: 
   - Create `/properties/buy` and `/properties/rent` pages
   - Add search filters using the database functions
   - Display properties with region-based filtering

3. **Verify Data**:
   - Check that all 10 properties are visible
   - Confirm regional searches work
   - Test price range filtering

## Troubleshooting

### If you get column errors:
- Make sure you ran `step1-comprehensive-schema-setup.sql` first
- Check that the properties table exists

### If you get user ID errors:
- The scripts create a demo agent automatically
- Check your auth.users table permissions

### If functions don't work:
- Verify you have the correct database permissions
- Check that the functions were created successfully

## Regional Property Distribution

After successful deployment, you'll have properties distributed across:

| Region | Properties | Types | Price Range |
|--------|-----------|-------|-------------|
| Region 2 | 2 | Villa, Vacation Rental | GYD 220K - 48M |
| Region 4 | 3 | Apartment, Condo, Townhouse | GYD 120K - 35M |
| Region 6 | 4 | House, Land, Fixer-Upper | GYD 5M - 12M |
| Region 10 | 1 | Family Home | GYD 25M |

This gives you a comprehensive foundation for property browsing with real Guyana locations and market-appropriate pricing!
