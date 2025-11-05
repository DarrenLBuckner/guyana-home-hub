# Portal Home Hub - CORS Redirect Diagnostic

## Problem Statement

Portal Home Hub is redirecting OPTIONS preflight requests instead of responding with CORS headers. This blocks all cross-origin API calls from Guyana Home Hub to Portal Home Hub.

**Current Error:**
```
Response to preflight request doesn't pass access control check: 
Redirect is not allowed for a preflight request.
```

**What's Happening:**
- Guyana Home Hub tries to fetch from `https://portalhomehub.com/api/public/services/GY`
- Browser sends OPTIONS preflight request first (standard CORS behavior)
- Portal Home Hub is REDIRECTING the OPTIONS request instead of responding
- Browser blocks the request because redirects aren't allowed during preflight
- Our API route never gets reached (even though it has proper CORS headers)

## Root Cause

The redirect is happening BEFORE the request reaches our CORS-configured API routes. Something in the Portal Home Hub configuration is intercepting and redirecting.

**Likely Culprits:**
1. **middleware.ts/js** - Intercepts ALL requests before they reach routes
2. **vercel.json** - Vercel deployment redirects/rewrites
3. **next.config.js/ts** - Next.js redirect configuration

---

## Diagnostic Commands

### Step 1: Navigate to Portal Home Hub

```powershell
cd "C:\LocalFiles\Home Hub Folders\Portal-home-hub"
```

### Step 2: Find Middleware Files

```powershell
Get-ChildItem -Recurse -Include "middleware.ts","middleware.js" | Select-Object FullName
```

**Expected Output:**
- Either: File path(s) like `C:\LocalFiles\...\src\middleware.ts`
- Or: Nothing (no middleware exists)

**If files are found, get their contents:**
```powershell
Get-Content "src\middleware.ts"
# OR
Get-Content "middleware.ts"
```

### Step 3: Check vercel.json

```powershell
Get-Content "vercel.json" -ErrorAction SilentlyContinue
```

**Expected Output:**
- Either: JSON configuration content
- Or: Error message (file doesn't exist)

### Step 4: Check next.config.js

```powershell
Get-Content "next.config.js" -ErrorAction SilentlyContinue
```

**Expected Output:**
- Either: JavaScript configuration content
- Or: Error message (file doesn't exist)

**If not found, try TypeScript version:**
```powershell
Get-Content "next.config.ts" -ErrorAction SilentlyContinue
```

### Step 5: Check next.config.mjs

```powershell
Get-Content "next.config.mjs" -ErrorAction SilentlyContinue
```

---

## What to Report Back

### For Command 2 (Middleware):
- [ ] **Did it find any files?** YES / NO
- [ ] **If YES:** Paste the full file path(s)
- [ ] **If YES:** Paste the complete file contents

### For Command 3 (vercel.json):
- [ ] **Does file exist?** YES / NO
- [ ] **If YES:** Paste the complete file contents

### For Command 4 (next.config.js):
- [ ] **Does file exist?** YES / NO
- [ ] **If YES:** Paste the complete file contents

### For Command 5 (next.config.mjs):
- [ ] **Does file exist?** YES / NO
- [ ] **If YES:** Paste the complete file contents

---

## What We're Looking For

In these files, we're searching for patterns like:

### In Middleware:
```typescript
// BAD - Causes redirects
if (condition) {
  return NextResponse.redirect(...)
}

// BAD - Doesn't handle OPTIONS
export function middleware(request: NextRequest) {
  // No OPTIONS check
  return NextResponse.next()
}
```

### In vercel.json:
```json
{
  "redirects": [...],  // Any redirects here
  "rewrites": [...]    // Any rewrites here
}
```

### In next.config:
```javascript
{
  async redirects() { ... },  // Any redirects
  async rewrites() { ... }    // Any rewrites
}
```

---

## Expected Fix

Once we identify the problematic configuration, we'll need to:

1. **If Middleware exists:** Add OPTIONS handling BEFORE any redirects
   ```typescript
   // Handle OPTIONS preflight first
   if (request.method === 'OPTIONS') {
     return new NextResponse(null, {
       status: 200,
       headers: {
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
         'Access-Control-Allow-Headers': 'Content-Type, Authorization',
       },
     })
   }
   ```

2. **If vercel.json has redirects:** Exclude `/api/public/*` paths from redirects

3. **If next.config has redirects:** Exclude API routes from redirect rules

---

## Questions for Developer

1. Did you find any middleware files?
2. Does vercel.json exist and what's in it?
3. Does next.config exist and what's in it?
4. Are there any redirects configured in any of these files?

**Please run all commands and report back findings for EACH step.**