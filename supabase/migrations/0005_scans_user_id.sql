-- Add user_id column to public.scans table to associate scans with authenticated users
ALTER TABLE public.scans ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON public.scans(user_id);
