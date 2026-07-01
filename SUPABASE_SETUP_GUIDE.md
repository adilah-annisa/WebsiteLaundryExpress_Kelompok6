# 📖 PANDUAN SETUP SUPABASE UNTUK LAUNDRY EXPRESS

## 🚀 QUICK START

### 1. CREATE SUPABASE PROJECT

```bash
# Visit: https://supabase.com
# 1. Sign up / Login
# 2. Click "New Project"
# 3. Fill in:
#    - Project Name: LaundryExpress
#    - Database Password: (strong password)
#    - Region: Southeast Asia (Singapore) - recommended for Indonesia
# 4. Wait for database initialization (5-10 minutes)
```

---

## 🔧 STEP 1: DATABASE SETUP

### 1.1 Access SQL Editor

```
1. Open Supabase Console
2. Navigate to: SQL Editor
3. Click "New Query"
4. Copy all code from `supabase-setup.sql`
5. Paste and run
6. Wait for completion
```

### 1.2 Verify Tables

```sql
-- Run this query to verify all tables created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected output:
```
- audit_logs
- couriers
- customers
- delivery_proofs
- notifications
- orders
- schedules
- services
- transactions
- users
```

---

## 💾 STEP 2: STORAGE SETUP

### 2.1 Create Storage Buckets

```
1. Go to Supabase Console > Storage
2. Click "New Bucket" for each:
   
   Bucket 1: avatars
   - Privacy: Public
   
   Bucket 2: delivery-proofs
   - Privacy: Private
   
   Bucket 3: receipts
   - Privacy: Private
   
   Bucket 4: order-documents
   - Privacy: Private
```

### 2.2 Configure CORS (Optional but Recommended)

```
For each bucket > Settings > CORS:
- Allowed origins: ["http://localhost:5173", "https://yourdomain.com"]
- Allowed methods: ["GET", "POST", "PUT", "DELETE"]
```

---

## 🔐 STEP 3: AUTHENTICATION SETUP

### 3.1 Enable Email Provider

```
1. Supabase Console > Authentication > Providers
2. Click "Email"
3. Toggle ON
4. Settings:
   - Confirm email: Disable (for development)
   - Double confirm changes: Disable
   - Require email verification: Enable (for production)
```

### 3.2 Configure Email Templates (Optional)

```
1. Authentication > Email Templates
2. Customize:
   - Confirmation template
   - Recovery template
   - Magic link template
```

---

## 🛠️ STEP 4: FRONTEND SETUP

### 4.1 Install Dependencies

```bash
cd frontend-laundry

# Install Supabase
npm install @supabase/supabase-js @supabase/auth-ui-react

# Install additional packages (optional)
npm install react-query # for data fetching
npm install zustand # for state management
```

### 4.2 Create Environment Variables

**File: `frontend-laundry/.env.local`**

```env
# Get these from Supabase Console > Settings > API
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Development
VITE_APP_ENV=development
VITE_API_URL=http://localhost:3000/api
```

**How to get keys:**

```
1. Open Supabase Console
2. Settings > API
3. Copy:
   - Project URL → VITE_SUPABASE_URL
   - anon [public] → VITE_SUPABASE_ANON_KEY
```

### 4.3 Create Supabase Client

**File: `frontend-laundry/src/lib/supabaseClient.js`**

```javascript
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### 4.4 Update Auth Context

```
Replace your AuthContext.jsx with updated version that uses supabaseApi.js
(See SUPABASE_DOCUMENTATION.md for complete code)
```

### 4.5 Update Data Context

```
Replace your DataContext.jsx with updated version
(See SUPABASE_DOCUMENTATION.md for complete code)
```

---

## 📊 STEP 5: DATA MIGRATION (From Dummy to Supabase)

### 5.1 Export Current Data

```javascript
// Run this in browser console to get current data
const data = JSON.parse(localStorage.getItem("app_data"));
console.log(JSON.stringify(data, null, 2));
// Copy output
```

### 5.2 Insert Initial Data

**Migrate Services (required):**

```sql
-- Already inserted by setup.sql
-- Check with:
SELECT * FROM services;
```

**Migrate Custom Data (optional):**

```javascript
// File: scripts/migrate-data.js
import { supabase } from "../src/lib/supabaseClient";

export async function migrateData(dummyData) {
  try {
    // Migrate users
    for (const user of dummyData.users) {
      await supabase.from("users").insert({
        id: generateUUID(), // Auto-generate
        email: user.email,
        role: user.role,
        full_name: user.name,
        phone: user.phone,
      });
    }

    // Migrate customers
    // ... (similar pattern)

    console.log("Data migration completed!");
  } catch (error) {
    console.error("Migration error:", error);
  }
}
```

---

## 🧪 STEP 6: TESTING

### 6.1 Test Authentication

```javascript
// File: src/__tests__/auth.test.js
import { authService } from "../services/supabaseApi";

describe("Authentication", () => {
  test("User can signup", async () => {
    const result = await authService.signup(
      "test@example.com",
      "password123",
      "Test User",
      "081234567890",
      "pelanggan"
    );
    expect(result.ok).toBe(true);
  });

  test("User can signin", async () => {
    const result = await authService.signin(
      "test@example.com",
      "password123"
    );
    expect(result.ok).toBe(true);
    expect(result.profile.role).toBe("pelanggan");
  });
});
```

### 6.2 Test Data Operations

```javascript
// File: src/__tests__/orders.test.js
import { orderService } from "../services/supabaseApi";

describe("Orders", () => {
  test("Customer can create order", async () => {
    const result = await orderService.create({
      customer_id: "customer-uuid",
      service_id: "service-uuid",
      delivery_type: "jemput",
      notes: "Test order",
    });
    expect(result.ok).toBe(true);
  });
});
```

---

## 🔍 STEP 7: DEBUGGING

### 7.1 Common Issues & Solutions

**Issue 1: Auth not working**

```
Error: "Missing Supabase environment variables"

Solution:
1. Check .env.local exists in root folder
2. Verify variables are prefixed with VITE_
3. Restart dev server after env changes
```

**Issue 2: Database errors**

```
Error: "relation 'users' does not exist"

Solution:
1. Verify all SQL in setup.sql was executed
2. Check table names (case-sensitive)
3. Run: SELECT * FROM information_schema.tables WHERE table_schema = 'public'
```

**Issue 3: RLS blocking requests**

```
Error: "new row violates row-level security policy"

Solution:
1. Check RLS policies in SQL Editor
2. Verify user is authenticated
3. Check policy conditions match your data
```

**Issue 4: CORS errors**

```
Error: "Access to XMLHttpRequest blocked by CORS policy"

Solution:
1. Check Storage bucket CORS settings
2. Add your domain to allowed origins
3. Verify bucket is set to "Public"
```

### 7.2 Enable Logs

```javascript
// In supabaseClient.js
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  debug: true, // Enable debug logging
});

// Check browser console for detailed logs
```

---

## 📱 STEP 8: REAL-TIME FEATURES (Optional)

### 8.1 Subscribe to Order Changes

```javascript
// src/hooks/useOrderSubscription.js
import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export function useOrderSubscription(orderId, onUpdate) {
  useEffect(() => {
    const subscription = supabase
      .from("orders")
      .on("UPDATE", (payload) => {
        if (payload.new.id === orderId) {
          onUpdate(payload.new);
        }
      })
      .subscribe();

    return () => supabase.removeSubscription(subscription);
  }, [orderId, onUpdate]);
}
```

### 8.2 Use in Component

```jsx
import { useOrderSubscription } from "../hooks/useOrderSubscription";

function OrderDetail({ orderId }) {
  const [order, setOrder] = useState(null);

  useOrderSubscription(orderId, (updatedOrder) => {
    setOrder(updatedOrder);
  });

  return <div>{order?.status}</div>;
}
```

---

## 🚀 STEP 9: DEPLOYMENT

### 9.1 Production Checklist

```
Security:
- [ ] Change RLS_ENABLED from false to true
- [ ] Set strong database password
- [ ] Disable email confirmation for development-only
- [ ] Setup custom domain for Supabase URL
- [ ] Enable 2FA on Supabase account

Environment:
- [ ] Update .env.production with prod URLs
- [ ] Verify ANON_KEY is safe to expose (it is)
- [ ] Setup proper storage bucket permissions
- [ ] Enable backups

Monitoring:
- [ ] Setup error logging (Sentry, LogRocket)
- [ ] Monitor database performance
- [ ] Setup alerts for high resource usage
```

### 9.2 Deploy to Production

```bash
# Build frontend
npm run build

# Deploy to Vercel (Recommended)
vercel

# Or: Deploy to Netlify
netlify deploy

# Or: Deploy to GitHub Pages
npm run build && git add dist && git commit -m "Deploy"
```

### 9.3 Backup Strategy

```
Supabase Console > Database > Backups
- Automatic daily backups included
- 7-day retention period free tier
- Manual backups available anytime
```

---

## 📚 USEFUL LINKS

```
- Supabase Documentation: https://supabase.com/docs
- Supabase API Reference: https://supabase.com/docs/reference
- PostgreSQL Docs: https://www.postgresql.org/docs/
- React Supabase Integration: https://supabase.com/docs/guides/getting-started/quickstarts/react
```

---

## 🎯 NEXT STEPS

1. ✅ Create Supabase project
2. ✅ Run database setup SQL
3. ✅ Create storage buckets
4. ✅ Setup authentication
5. ✅ Install npm packages
6. ✅ Create .env.local file
7. ✅ Update contexts (Auth & Data)
8. ✅ Test authentication flow
9. ✅ Test CRUD operations
10. ✅ Deploy to production

---

## 📞 SUPPORT

**If you encounter issues:**

1. Check Supabase Console > Logs for error details
2. Review SUPABASE_DOCUMENTATION.md
3. Consult Supabase docs: https://supabase.com/docs
4. Check browser console for JavaScript errors

---

## ✨ CONGRATULATIONS!

Your Laundry Express application is now ready to use Supabase! 🎉

Next: Move to implementation phase and start integrating API calls in your React components.
