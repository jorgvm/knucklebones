# Database Migration Setup

Steps to create initial migration from existing Supabase DB:

1. Install dependencies (Supabase CLI included as dev dep):

   ```bash
   pnpm install
   ```

2. Init Supabase in project root:

   ```bash
   pnpm supabase init
   ```

3. Link to existing project:

   ```bash
   pnpm supabase link --project-ref <your-project-ref>
   # project-ref = ID in Supabase dashboard URL
   ```

4. Dump existing schema:

   ```bash
   pnpm supabase db dump --file supabase/migrations/20260510000000_initial_schema.sql
   ```
