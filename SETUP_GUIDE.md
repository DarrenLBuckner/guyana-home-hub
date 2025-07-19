# Guyana Home Hub - Business Partner Setup Guide

## 🚀 **Quick Setup for Your Business Partner**

### **1. System Overview**
- **Agent Login**: `/agent-login` - For property agents
- **Admin Login**: `/admin-login` - For Guyana Home Hub staff (you)
- **Agent Registration**: `/agent-register` - For new agents

### **2. Admin Account Setup (You)**

1. **Go to your Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Navigate to: Authentication → Users

2. **Create Admin User**
   - Click "Add User"
   - Email: `admin@guyanahomehub.com`
   - Password: `AdminHub2025!`
   - Click "Create User"

3. **Set Admin Role**
   - Go to: Table Editor → `profiles` table
   - Add new row:
     - `id`: (copy UUID from the user you just created)
     - `email`: `admin@guyanahomehub.com`
     - `role`: `admin`
     - `created_at`: (current timestamp)

### **3. Business Partner Account Setup**

**Option A: You create it for them**
1. Go to `/agent-register`
2. Fill out the form:
   - Full Name: [Your partner's name]
   - Email: [Their email]
   - Phone: [Their phone]
   - Location: [Their area in Guyana]
   - Password: [Create a secure password]

**Option B: They create it themselves**
1. Send them this link: `http://localhost:3000/agent-register`
2. They fill out their own details
3. They'll receive email verification

### **4. Test the Complete Workflow**

**As Agent (Your Business Partner):**
1. Go to `/agent-login`
2. Sign in with agent credentials
3. Click "Add New Property"
4. Fill out property details
5. Try the "🤖 Generate with AI" button for description
6. Upload photos
7. Submit property (will be marked as "pending")

**As Admin (You):**
1. Go to `/admin-login`
2. Sign in with admin credentials
3. Review pending properties
4. Approve or reject properties
5. Approved properties will show up on public site

### **5. Key Features for Your Partner**

- **AI Description Generator**: Uses OpenAI to write property descriptions
- **Photo Upload**: Drag & drop with hero image selection
- **Property Management**: View submitted properties and their status
- **Professional Interface**: Clean, easy-to-use forms

### **6. URLs to Share**

- **Agent Registration**: `http://localhost:3000/agent-register`
- **Agent Login**: `http://localhost:3000/agent-login`
- **Admin Login**: `http://localhost:3000/admin-login`

### **7. Future Enhancements**

- **Auto-Approval**: For trusted agents who pay monthly
- **Advanced Analytics**: Track property performance
- **Mobile App**: For on-the-go property management

---

## 📞 **Support**
If you need help with setup, just ask me! I can walk you through any step.
