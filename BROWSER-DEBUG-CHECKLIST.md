# 🔍 BROWSER DEBUGGING CHECKLIST

**Instructions:** Visit jamaicahomehub.com and check these items in browser developer tools

---

## 🍪 STEP 1: Check Cookies

1. **Open Developer Tools** (F12)
2. **Go to Application tab**
3. **Check Cookies section**
4. **Look for `country-code` cookie**

**Expected:** `country-code = JM`  
**Actual:** `________________`

**Screenshot:** Take a screenshot of the cookies section

---

## 🎨 STEP 2: Check CSS Variables

1. **Go to Elements tab**
2. **Click on `<html>` element**
3. **Go to Computed styles**
4. **Search for CSS variables**

**Check these values:**
- `--primary`: Expected `#009639` (Jamaica green), Actual: `________________`
- `--secondary`: Expected `#FFD700` (Jamaica gold), Actual: `________________`
- `--accent`: Expected `#0077BE` (Jamaica blue), Actual: `________________`

**Screenshot:** Take a screenshot of the CSS variables

---

## 🌐 STEP 3: Check Network Requests

1. **Go to Network tab**
2. **Refresh the page**
3. **Look for `/api/properties` request**
4. **Click on the request**
5. **Check the Request URL**

**Expected:** URL should contain `?site=jamaica`  
**Actual:** `________________`

**Response:** Check if response contains Jamaica properties or Guyana properties  
**Properties shown:** `________________`

---

## 📝 STEP 4: Check Console Logs

**Look for these specific log messages:**

1. **Middleware Detection:**
   - Expected: `🌍 MIDDLEWARE: Detected country: JM from hostname: jamaicahomehub.com`
   - Found: YES/NO `________________`

2. **Cookie Setting:**
   - Expected: `🍪 MIDDLEWARE: Set country-code cookie to: JM`
   - Found: YES/NO `________________`

3. **Server Cookie Reading:**
   - Expected: `🍪 SERVER: Read country from cookie: JM`
   - Found: YES/NO `________________`

4. **Theme Application:**
   - Expected: `🎨 THEME: Applied JM theme - Primary: #009639, Name: Jamaica Home Hub`
   - Found: YES/NO `________________`

5. **API Filtering:**
   - Expected: `🌍 API: Using site filter: jamaica (from country: JM)`
   - Found: YES/NO `________________`

**Screenshot:** Take a screenshot of the console

---

## 🏠 STEP 5: Check Visual Elements

**Check these page elements:**

1. **Site Title in Browser Tab:**
   - Expected: "Jamaica Home Hub"
   - Actual: `________________`

2. **Header Logo/Text:**
   - Expected: "Jamaica Home Hub"
   - Actual: `________________`

3. **Footer Text:**
   - Expected: "© 2025 Jamaica Home Hub. All rights reserved."
   - Actual: `________________`

4. **Button Colors:**
   - Expected: Green (#009639)
   - Actual: `________________` (Blue/Green/Other)

5. **Homepage Heading:**
   - Expected: "Why Choose Jamaica Home Hub?"
   - Actual: `________________`

---

## 🔄 STEP 6: Compare with Guyana Site

**Visit guyanahomehub.com and check:**

1. **Cookies:** country-code = `________________`
2. **CSS --primary:** `________________`
3. **Site Title:** `________________`
4. **Button Colors:** `________________`
5. **API URL:** Contains `site=guyana`? YES/NO

---

## 📊 SUMMARY REPORT

**Fill this out after testing:**

```
DOMAIN TESTED: jamaicahomehub.com
DATE: ________________
BROWSER: ________________

DETECTION WORKING:
- Country cookie set: YES/NO
- Correct country detected: YES/NO
- Console logs present: YES/NO

STYLING WORKING:
- CSS variables correct: YES/NO
- Green colors showing: YES/NO
- Jamaica branding showing: YES/NO

DATA WORKING:
- API filtering by country: YES/NO
- Jamaica properties showing: YES/NO
- Correct site parameter: YES/NO

OVERALL STATUS:
- Site looks identical to Guyana: YES/NO
- Any differences visible: YES/NO
- System appears to be working: YES/NO

BIGGEST ISSUE OBSERVED:
________________

SCREENSHOTS TAKEN:
- Cookies: YES/NO
- CSS Variables: YES/NO
- Console: YES/NO
- Network: YES/NO
```

---

## 🚨 URGENT FINDINGS

**If you find any of these, report immediately:**

- ❌ No `country-code` cookie
- ❌ Cookie shows `GY` instead of `JM`
- ❌ CSS variables still show blue colors
- ❌ Console shows no theme switching logs
- ❌ API requests don't filter by country
- ❌ Site title/branding unchanged

**This data will help us pinpoint the exact failure point! 🎯**