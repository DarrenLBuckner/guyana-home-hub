# Claude Commands & Checkpoint System

This directory contains templates and checkpoints for managing development sessions with Claude Code for Guyana Home Hub. Use these to maintain context between sessions and ensure smooth handoffs.

---

## 📁 **Directory Structure**

```
.claude/
└── commands/
    ├── README.md                 ← You are here
    ├── checkpoint-template.md    ← Reusable template for creating checkpoints
    ├── current-checkpoint.md     ← Latest project state and handoff info
    └── [date]-checkpoint.md      ← Historical checkpoints (create as needed)
```

---

## 🚀 **Quick Start Guide**

### **For Current Session (Starting Work):**
1. **Read** `current-checkpoint.md` to understand project state
2. **Review** Portal Home Hub integration requirements
3. **Check** environment setup and API configuration needs
4. **Start** working on high-priority integration tasks

### **For Session End (Handing Off):**
1. **Update** `current-checkpoint.md` with recent progress
2. **Add** any integration discoveries or API issues
3. **Update** next priority tasks based on Portal API status
4. **Create** dated checkpoint if major integration milestone reached

---

## 🔗 **Guyana Home Hub Specific Context**

### **Project Overview:**
- **Purpose:** Public-facing real estate platform for Guyana market
- **Architecture:** Next.js frontend + Portal Home Hub API integration
- **Current State:** Standalone platform that needs Portal API integration
- **Unique Features:** Agent vetting system, admin approval workflow

### **Critical Integration Points:**
1. **Property Data:** Should fetch from Portal Home Hub's `/api/public/properties?site=guyana`
2. **Favorites System:** Should integrate with Portal's public favorites API
3. **Agent Management:** Keep local agent vetting but sync with Portal system
4. **Admin Features:** Maintain local admin controls for Guyana-specific management

---

## 📋 **Guyana-Specific Checkpoint Sections**

### **Portal Integration Status:**
Always include in checkpoints:
- **API Connection:** Portal Home Hub API configuration status
- **Data Source:** Local database vs Portal API data flow
- **Site Filtering:** Guyana property filtering implementation
- **Favorites Sync:** Cross-platform favorites integration status

### **Agent System Status:**
Critical local features to track:
- **Vetting Workflow:** Agent registration and approval process
- **Document Management:** File upload and verification system
- **Admin Oversight:** Local admin controls and approvals
- **Professional Network:** Agent directory and search functionality

### **Performance Considerations:**
- **API Response Times:** Portal Home Hub API performance
- **Data Caching:** Property data caching strategy
- **Image Optimization:** Property image loading and display
- **Mobile Experience:** Responsive design for Guyana users

---

## 🎯 **Priority Framework for Guyana Home Hub**

### **Always High Priority:**
1. **Portal API Integration** - Core dependency for property data
2. **Site Filtering Accuracy** - Ensure only Guyana properties shown
3. **Agent System Functionality** - Local agent vetting must work
4. **Admin Access** - [CHH-SYS] admin controls must be operational

### **Medium Priority:**
1. **Performance Optimization** - Fast loading for local users
2. **Mobile Responsiveness** - Mobile-first design improvements
3. **Search Enhancement** - Advanced property filtering
4. **User Experience** - Navigation and interaction improvements

### **Low Priority:**
1. **Advanced Features** - Enhanced analytics and tracking
2. **SEO Optimization** - Search engine optimization
3. **Third-party Integrations** - Additional service integrations

---

## 🔧 **Development Commands for Guyana Home Hub**

### **Start Development:**
```bash
# Navigate to Guyana Home Hub
cd "/mnt/c/LocalFiles/Home Hub Folders/guyana-home-hub"

# Install dependencies
npm install

# Start development server
npm run dev

# View at http://localhost:3000
```

### **Test Portal Integration:**
```bash
# Test Portal API connection (when implemented)
curl "http://localhost:3001/api/public/properties?site=guyana"

# Test local API endpoints
curl "http://localhost:3000/api/properties"
```

### **Check Database Status:**
```bash
# Review deployment status
cat DEPLOYMENT-STATUS.md

# Check recent SQL migrations
ls -la *.sql | tail -5
```

---

## 🚨 **Emergency Integration Protocols**

### **If Portal API is Down:**
1. **Document the Issue** - Record API status and error messages
2. **Check Local Fallback** - Ensure local database can serve as backup
3. **Update Current Checkpoint** - Note API dependency and impact
4. **Create Contingency Plan** - Define alternative data source strategy

### **If Agent System Breaks:**
1. **Priority Assessment** - Agent vetting is core Guyana feature
2. **Database Check** - Verify Supabase connection and tables
3. **File Upload Test** - Ensure document storage is working
4. **Admin Access Test** - Verify [CHH-SYS] admin controls

---

## 📊 **Integration Success Metrics**

### **Portal API Integration:**
- [ ] Properties load from Portal API with `?site=guyana` filter
- [ ] Property details display correctly with all fields
- [ ] Images load properly from Portal storage
- [ ] Search and filtering work with Portal data
- [ ] Favorites sync between platforms

### **Local Feature Integrity:**
- [ ] Agent registration and vetting workflow operational
- [ ] Admin approval process working
- [ ] Document upload and storage functional
- [ ] [CHH-SYS] admin access secure and working

### **Performance Benchmarks:**
- [ ] Page load times under 3 seconds
- [ ] API response times under 1 second
- [ ] Mobile responsiveness across devices
- [ ] Image loading optimization

---

## 💡 **Guyana Home Hub Best Practices**

### **When Working on Integration:**
1. **Portal First:** Always check Portal Home Hub status before local changes
2. **Site Filtering:** Test Guyana-specific filtering thoroughly
3. **Data Consistency:** Ensure property data matches Portal source
4. **Agent Features:** Protect local agent vetting functionality

### **When Updating Checkpoints:**
1. **Integration Status:** Always document Portal API connection state
2. **Data Flow:** Clearly describe property data source (local vs Portal)
3. **Agent System:** Note any changes to local agent management
4. **Performance:** Include API response times and loading metrics

### **When Testing:**
1. **Cross-Platform:** Test features that depend on Portal integration
2. **Local Features:** Ensure agent and admin systems work independently
3. **Edge Cases:** Test when Portal API is unavailable
4. **Mobile First:** Test on mobile devices for Guyana market

---

## 🔗 **Related Guyana Home Hub Resources**

### **Local Documentation:**
- **DEPLOYMENT-STATUS.md** - Complete feature deployment status
- **PARTNER-ADMIN-LOGIN-INSTRUCTIONS.md** - Admin access documentation
- **DEVELOPMENTS-INTEGRATION-GUIDE.md** - Integration guidance
- **MODERN-COMPONENTS.md** - UI component documentation

### **Portal Integration:**
- **Portal API Endpoint:** `http://portal-hub/api/public/properties?site=guyana`
- **Favorites API:** `http://portal-hub/api/public/favorites`
- **Portal Documentation:** `../Portal-home-hub/.claude/commands/`

### **Database & Security:**
- **Supabase Dashboard** - Monitor local database performance
- **Security Policies** - FINAL-security-policies.sql for reference
- **Agent Vetting Schema** - FINAL-agent-vetting-clean.sql

---

## 🎓 **Training Claude on Guyana Home Hub**

When starting a new session with Claude, provide this context:

```
Guyana Home Hub is a public real estate platform that should integrate with Portal Home Hub's API. 
Read .claude/commands/current-checkpoint.md for project status. 

Key focus areas:
1. Portal Home Hub API integration for property data
2. Site filtering to show only Guyana properties
3. Maintaining local agent vetting system
4. Protecting admin controls via [CHH-SYS] access

Current critical issue: Integration with Portal Home Hub API needs implementation.
```

---

## 🎯 **Success Criteria for Guyana Home Hub**

### **Integration Success:**
- Properties load from Portal API with proper Guyana filtering
- Favorites system syncs between platforms
- Performance meets mobile-first requirements
- Agent vetting system remains fully functional

### **Feature Completeness:**
- Agent registration and professional verification
- Admin approval workflow for agents and properties
- Public property browsing with search/filter
- Mobile-optimized responsive design

### **Production Readiness:**
- Portal API integration stable and tested
- Local features independent and reliable
- Security policies protecting sensitive data
- Performance optimized for Guyana internet speeds

---

*This checkpoint system was created specifically for Guyana Home Hub development.*  
*Last updated: 2025-01-23*

*Remember: Guyana Home Hub should be the public face consuming Portal Home Hub's API data while maintaining its unique agent vetting and admin features.*