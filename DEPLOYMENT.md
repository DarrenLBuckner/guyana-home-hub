# Guyana Home Hub - Production Deployment Guide

## Prerequisites
- Vercel account connected to GitHub repository
- Supabase project with advertising schema applied
- Portal Home Hub deployed and accessible

## Environment Variables Setup

### Required for Production Deployment

Copy these environment variables to your Vercel project settings:

```bash
# Portal API Configuration
NEXT_PUBLIC_PORTAL_API_URL=https://your-portal-domain.vercel.app

# Supabase Configuration  
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Server-side only (NEVER use NEXT_PUBLIC_ prefix)
PORTAL_SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Mapbox (Optional - for property maps)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token

# Email Service (Optional - for contact forms)
RESEND_API_KEY=your-resend-api-key

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Production Settings
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-guyana-hub-domain.vercel.app
```

## Deployment Steps

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your `guyana-home-hub` repository
   - Configure environment variables in Project Settings

3. **Set Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add ALL variables from the list above
   - Use "Production" environment for all variables
   - NEVER expose the `PORTAL_SUPABASE_SERVICE_ROLE_KEY` with NEXT_PUBLIC prefix

4. **Deploy**
   - Vercel will automatically deploy when you push to main branch
   - Monitor deployment in Vercel dashboard

## Post-Deployment Checklist

- [ ] Test home page loads correctly
- [ ] Verify services section works
- [ ] Check advertisement display functionality  
- [ ] Test Portal API connectivity
- [ ] Verify Supabase database connections
- [ ] Confirm mobile responsiveness
- [ ] Test contact forms (if configured)

## Troubleshooting

### Common Issues:

1. **Advertisement not loading**: Check NEXT_PUBLIC_PORTAL_API_URL is correct
2. **Database errors**: Verify Supabase keys and URL
3. **Build failures**: Check all dependencies in package.json
4. **API errors**: Ensure Portal Home Hub is deployed first

### Environment Variable Security:

- ✅ NEXT_PUBLIC_ variables are safe for client-side
- ❌ NEVER use NEXT_PUBLIC_ with service role keys
- ✅ Server-side routes can access non-public env vars
- ❌ Don't commit .env.local to git

## Dependencies

This deployment requires:
- Portal Home Hub running and accessible
- Supabase database with advertising schema
- GitHub repository with latest commits pushed