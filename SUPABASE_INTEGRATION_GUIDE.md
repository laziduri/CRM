# Supabase Integration Guide for Brilliance Advisory CRM

## Current State Analysis

Your CRM currently uses:
- **In-memory storage** (Map-based) for sessions (`lib/session.ts`)
- **Mock data** for tasks, loans, clients
- **Custom JWT authentication** (jsonwebtoken + bcryptjs)
- **No persistent database** - data lost on server restart

## What You Can Use Supabase For

Supabase is a PostgreSQL database with built-in features. Here's what you can leverage:

---

## 1. **Database & Data Persistence** 📊

Replace all in-memory storage with Supabase PostgreSQL:

### **Current Problems:**
- Tasks stored in memory arrays (lost on restart)
- Sessions in Map (not persistent)
- Clients/Consultants not stored properly
- No data relationships or foreign keys

### **Supabase Solution:**
Create tables for all your entities:

```sql
-- Users (Clients & Consultants)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT,
  phone TEXT,
  profile_picture TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consultants
CREATE TABLE consultants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultant_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT,
  profile_picture TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultant_id UUID REFERENCES consultants(id),
  client_id UUID REFERENCES clients(id),
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT,
  priority TEXT,
  status TEXT DEFAULT 'pending',
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  estimated_duration INTEGER,
  ai_suggested BOOLEAN DEFAULT FALSE,
  ai_recommendations TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  archived BOOLEAN DEFAULT FALSE
);

-- Appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultant_id UUID REFERENCES consultants(id),
  client_id UUID REFERENCES clients(id),
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  description TEXT,
  meeting_link TEXT,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions (for tracking active sessions)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  user_type TEXT NOT NULL, -- 'client' or 'consultant'
  session_id TEXT UNIQUE NOT NULL,
  device_id TEXT,
  device_info TEXT,
  ip_address TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loan Applications
CREATE TABLE loan_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  loan_type TEXT NOT NULL,
  amount DECIMAL,
  tenure_months INTEGER,
  status TEXT DEFAULT 'pending',
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Benefits:**
- ✅ Persistent data (survives server restarts)
- ✅ ACID transactions
- ✅ Foreign key relationships
- ✅ Indexes for performance
- ✅ Data integrity

---

## 2. **Authentication & User Management** 🔐

Replace your custom JWT system with Supabase Auth:

### **Current Issues:**
- Manual JWT token generation
- In-memory session storage
- Custom password hashing with bcryptjs
- Manual token refresh logic

### **Supabase Solution:**
Use Supabase Auth which provides:

```typescript
// Instead of custom JWT, use Supabase Auth
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: {
      name: 'John Doe',
      user_type: 'client' // or 'consultant'
    }
  }
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// Session management (automatic)
const { data: { session } } = await supabase.auth.getSession()

// Sign out
await supabase.auth.signOut()
```

**Benefits:**
- ✅ Built-in session management
- ✅ Automatic token refresh
- ✅ Email verification
- ✅ Password reset flows
- ✅ OAuth providers (Google, GitHub, etc.)
- ✅ Multi-factor authentication (MFA)
- ✅ Row Level Security (RLS) policies

---

## 3. **Real-time Features** ⚡

Enable live updates without polling:

### **Use Cases for Your CRM:**

**Real-time Task Updates:**
```typescript
// Listen for task changes
const channel = supabase
  .channel('tasks')
  .on('postgres_changes', 
    { 
      event: '*', // INSERT, UPDATE, DELETE
      schema: 'public',
      table: 'tasks',
      filter: `consultant_id=eq.${consultantId}`
    },
    (payload) => {
      console.log('Task changed:', payload)
      // Update UI in real-time
    }
  )
  .subscribe()
```

**Live Appointment Notifications:**
- Notify consultants when clients book appointments
- Alert clients when appointments are rescheduled
- Show "someone is viewing this appointment" indicators

**Real-time Chat** (for your AI chatbot):
```typescript
// Store chat messages in Supabase
const channel = supabase
  .channel('chat')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => {
      // Show new message in real-time
    }
  )
  .subscribe()
```

**Live Collaboration:**
- Multiple consultants viewing same client
- Live typing indicators
- Real-time document editing

**Benefits:**
- ✅ No polling needed
- ✅ Instant updates
- ✅ WebSocket connections
- ✅ Automatic reconnection
- ✅ Presence awareness

---

## 4. **File Storage** 📁

Store documents, profile pictures, and attachments:

### **Use Cases:**
- Client documents (ID, income statements)
- Profile pictures
- Loan application documents
- Contract PDFs
- Meeting recordings

```typescript
// Upload file
const { data, error } = await supabase.storage
  .from('documents')
  .upload(`clients/${clientId}/document.pdf`, file)

// Get public URL
const { data } = supabase.storage
  .from('documents')
  .getPublicUrl(`clients/${clientId}/document.pdf`)

// Download file
const { data, error } = await supabase.storage
  .from('documents')
  .download(`clients/${clientId}/document.pdf`)
```

**Benefits:**
- ✅ CDN-backed storage
- ✅ Automatic image optimization
- ✅ Access control per bucket
- ✅ File versioning
- ✅ Up to 100GB free

---

## 5. **Row Level Security (RLS)** 🔒

Secure data access at the database level:

```sql
-- Only consultants can see their own tasks
CREATE POLICY "Consultants see own tasks"
ON tasks FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM consultants WHERE id = tasks.consultant_id
  )
);

-- Clients can only see their own data
CREATE POLICY "Clients see own profile"
ON clients FOR SELECT
USING (auth.uid() = id);
```

**Benefits:**
- ✅ Security at database level
- ✅ No data leaks even if API is compromised
- ✅ Per-user data access rules
- ✅ Multi-tenant support

---

## 6. **Edge Functions** ⚙️

Serverless functions for complex operations:

### **Use Cases:**

**AI Task Prioritization:**
```typescript
// Edge Function: /functions/ai-prioritize-tasks
// Instead of /api/ai/tasks/prioritize, use Edge Function
const { data } = await supabase.functions.invoke('ai-prioritize-tasks', {
  body: { tasks }
})
```

**Email Sending:**
```typescript
// Edge Function for sending emails
// Replace Resend API calls with Supabase Edge Functions
const { data } = await supabase.functions.invoke('send-email', {
  body: { to, subject, template }
})
```

**Calendar Sync:**
```typescript
// Google Calendar sync in Edge Function
// Instead of /api/consultant/calendar/google/sync
const { data } = await supabase.functions.invoke('sync-google-calendar')
```

**Benefits:**
- ✅ Serverless (no server management)
- ✅ Global edge network (fast)
- ✅ Automatic scaling
- ✅ TypeScript support
- ✅ Database access built-in

---

## 7. **Database Features** 🗄️

PostgreSQL advanced features:

### **Full-Text Search:**
```sql
-- Search clients by name, email
CREATE INDEX clients_search_idx ON clients USING gin(to_tsvector('english', name || ' ' || email));

SELECT * FROM clients 
WHERE to_tsvector('english', name || ' ' || email) @@ to_tsquery('john');
```

### **JSON/JSONB Support:**
```sql
-- Store flexible task metadata
ALTER TABLE tasks ADD COLUMN metadata JSONB;

-- Query JSON fields
SELECT * FROM tasks WHERE metadata->>'custom_field' = 'value';
```

### **Aggregations & Analytics:**
```sql
-- Get task statistics
SELECT 
  status,
  COUNT(*) as count,
  AVG(estimated_duration) as avg_duration
FROM tasks
WHERE consultant_id = $1
GROUP BY status;
```

### **Triggers & Functions:**
```sql
-- Auto-update updated_at timestamp
CREATE TRIGGER update_updated_at
BEFORE UPDATE ON clients
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## 8. **Migration Path** 🚀

### **Phase 1: Database Setup**
1. Create Supabase project
2. Design schema (tables above)
3. Run migrations
4. Set up RLS policies

### **Phase 2: Authentication Migration**
1. Install `@supabase/supabase-js`
2. Replace custom JWT with Supabase Auth
3. Migrate existing users to Supabase
4. Update API routes to use Supabase Auth

### **Phase 3: Data Migration**
1. Replace in-memory arrays with Supabase queries
2. Update all API routes (`/api/consultant/tasks`, etc.)
3. Test thoroughly
4. Deploy

### **Phase 4: Advanced Features**
1. Add real-time subscriptions
2. Implement file storage
3. Set up Edge Functions
4. Add analytics queries

---

## 9. **Recommended Priority** ⭐

**High Priority (Start Here):**
1. ✅ **Database tables** - Replace in-memory storage
2. ✅ **Authentication** - Migrate to Supabase Auth
3. ✅ **Tasks storage** - Move tasks to database

**Medium Priority:**
4. ⚡ **Real-time** - Add live updates for tasks/appointments
5. 📁 **File storage** - Store client documents
6. 🔒 **RLS policies** - Secure data access

**Low Priority (Nice to Have):**
7. ⚙️ **Edge Functions** - Move complex logic to edge
8. 📊 **Analytics** - Advanced queries and reporting
9. 🔍 **Full-text search** - Better search capabilities

---

## 10. **Quick Start Example**

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// app/api/consultant/tasks/route.ts (Updated)
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const consultantId = request.headers.get('x-consultant-id')
  
  // Instead of mockTasksStorage, query Supabase
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('consultant_id', consultantId)
    .eq('archived', false)
    .order('created_at', { ascending: false })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ tasks })
}

// Create task
export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      consultant_id: body.consultantId,
      client_id: body.clientId,
      title: body.title,
      // ... other fields
    })
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ task: data })
}
```

---

## 11. **Cost Considerations** 💰

**Free Tier Includes:**
- 500MB database storage
- 1GB file storage
- 2GB bandwidth
- 500MB Edge Function invocations
- Unlimited API requests
- 50,000 monthly active users

**Paid Plans:**
- Pro: $25/month (8GB database, 100GB storage)
- Team: $599/month (for larger teams)

For most CRMs, the free tier is sufficient to start.

---

## Summary

Supabase can replace:
- ❌ In-memory storage → ✅ PostgreSQL database
- ❌ Custom JWT auth → ✅ Supabase Auth
- ❌ Manual sessions → ✅ Automatic session management
- ❌ Polling for updates → ✅ Real-time subscriptions
- ❌ External file storage → ✅ Built-in storage
- ❌ Complex security logic → ✅ Row Level Security

This will make your CRM **more scalable, secure, and maintainable**!

Would you like me to help you:
1. Set up the database schema?
2. Migrate authentication?
3. Update API routes to use Supabase?
4. Add real-time features?
