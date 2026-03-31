---
name: supabase-security
description: Instructions for controlling security in backend implementations with Supabase
---

# Supabase Security Guidelines

When generating, modifying, or reviewing code related to Supabase backend implementations, strictly adhere to the following security rules.

## 1. Row Level Security (RLS)
- **Always Enable RLS**: Ensure every table has Row Level Security enabled (`ALTER TABLE public."table_name" ENABLE ROW LEVEL SECURITY;`).
- **Never bypass RLS unnecessarily**: Tables should not be created without adding RLS unless explicitly requested for a highly specific reason.

## 2. Auth Policies
- **Strict Access**: Define explicit and granular policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE` operations.
- **User Identification**: Always use `auth.uid()` to ensure authenticated users can only access or modify their own data.
  - Example: `CREATE POLICY "User can view own data" ON my_table FOR SELECT USING (auth.uid() = user_id);`
- **Public Access**: Only allow anonymous access (using `anon` role) if the data is explicitly meant to be public.

## 3. Keys and Environment Variables
- **Client Side (Anon Key)**: Only use the `anon` key (e.g., `VITE_SUPABASE_ANON_KEY`) in frontend code.
- **Server Side (Service Role Key)**: **NEVER** expose the `service_role` key to the client. It bypasses RLS completely. Use it only in secure, server-side environments (like Edge Functions or a separate Node.js backend) when administrative tasks are required.

## 4. Postgres Functions and Triggers
- **Execution Context**: When creating PostgreSQL functions, default to `SECURITY INVOKER`. This ensures the function runs with the privileges of the user calling it and respects RLS. 
- **Security Definer**: Use `SECURITY DEFINER` only when strictly necessary (e.g., for administrative actions) and ensure the function logic is tightly scoped and validated to prevent privilege escalation.

## 5. Input Validation
- Do not solely rely on RLS. Always implement proper schema validation (e.g., using Zod) in your server-side handlers or Edge Functions before interacting with the database.
- Use Supabase Auth for managing user sessions and avoid custom token handling unless necessary.

## 6. Client Subscriptions & Memory Leaks
- **Clean Up Subscriptions**: Whenever subscribing to real-time events (`supabase.channel().subscribe()`) or auth state changes (`supabase.auth.onAuthStateChange()`), ALWAYS ensure that the subscription is explicitly cleaned up and unsubscribed when the component unmounts.