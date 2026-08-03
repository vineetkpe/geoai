-- 1. Add is_admin column to public.users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- 2. Create upgrade_requests table
CREATE TABLE IF NOT EXISTS public.upgrade_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

-- 3. Unique partial index to ensure a user cannot have multiple 'pending' requests
CREATE UNIQUE INDEX IF NOT EXISTS idx_upgrade_requests_user_pending 
ON public.upgrade_requests(user_id) 
WHERE status = 'pending';

-- 4. Enable Row Level Security
ALTER TABLE public.upgrade_requests ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for upgrade_requests: users can SELECT and INSERT their own requests only
DROP POLICY IF EXISTS "Users can select own upgrade requests" ON public.upgrade_requests;
CREATE POLICY "Users can select own upgrade requests"
    ON public.upgrade_requests
    FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own upgrade requests" ON public.upgrade_requests;
CREATE POLICY "Users can insert own upgrade requests"
    ON public.upgrade_requests
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Note: No UPDATE/DELETE policies are added for public users.
-- Only the service role bypasses RLS to update request status upon approval/rejection.
