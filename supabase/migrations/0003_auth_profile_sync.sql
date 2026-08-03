-- 1. Ensure plan column exists on public.users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free';

-- 2. Trigger function on auth.users (AFTER INSERT) that inserts a matching row into public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, plan, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    'free',
    COALESCE(NEW.created_at, NOW())
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if present and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Enable RLS on public.users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Add policies so a user can SELECT and UPDATE only their own row (auth.uid() = id)
DROP POLICY IF EXISTS "Users can select own profile" ON public.users;
CREATE POLICY "Users can select own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. Service role bypasses RLS by default in Supabase. No policy blocks service role access.