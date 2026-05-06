-- ======================================================
-- 1. PROFILES (linked to auth.users)
-- ======================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid        PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role        text        NOT NULL CHECK (role IN ('client', 'technician', 'admin', 'employee')),
  full_name   text,
  avatar_url  text,
  status      text        DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_authenticated" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;

-- Authenticated users can read all profiles
CREATE POLICY "profiles_select_authenticated"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can only update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update all profiles
CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert handled by trigger
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Admins can delete profiles
CREATE POLICY "profiles_delete_admin"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Auto-create profile row on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, status, created_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'role', 'client'),
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    CASE 
      WHEN (new.raw_user_meta_data->>'role') = 'technician' THEN 'pending'
      ELSE 'approved'
    END,
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ======================================================
-- 2. TICKETS
-- ======================================================
CREATE TABLE IF NOT EXISTS public.tickets (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id     uuid        NOT NULL REFERENCES public.profiles(id),
  technician_id   uuid        REFERENCES public.profiles(id),
  title           text        NOT NULL,
  description     text        NOT NULL,
  category        text        NOT NULL CHECK (category IN ('Réseau','Logiciel','Matériel','Autre')),
  priority        text        NOT NULL CHECK (priority IN ('bloquant','haute','normale')),
  status          text        NOT NULL DEFAULT 'open' CHECK (status IN ('open','new','in_progress','resolved')),
  system_info     text,
  screenshot_url  text,
  created_at      timestamptz DEFAULT now(),
  resolved_at     timestamptz,
  resolution      text
);

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tickets_select_authorized" ON public.tickets;
DROP POLICY IF EXISTS "tickets_insert_authorized" ON public.tickets;
DROP POLICY IF EXISTS "tickets_update_staff" ON public.tickets;

-- SELECT POLICY: Clients see own, Staff sees all
CREATE POLICY "tickets_select_all"
  ON public.tickets FOR SELECT
  TO authenticated
  USING (
    auth.uid() = employee_id 
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('technician', 'admin')
    )
  );

-- INSERT POLICY: Clients can insert tickets
CREATE POLICY "Clients can insert tickets"
  ON public.tickets FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = employee_id
  );

-- UPDATE POLICY: Technicians can update if unassigned OR assigned to them. Admin always.
CREATE POLICY "tickets_update_authorized"
  ON public.tickets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
    OR (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'technician')
      AND (technician_id IS NULL OR technician_id = auth.uid())
    )
  );


-- ======================================================
-- 3. MESSAGES
-- ======================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id          bigint      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  ticket_id   uuid        REFERENCES public.tickets(id) ON DELETE CASCADE,
  sender_id   uuid        REFERENCES public.profiles(id),
  content     text        NOT NULL,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_select" ON public.messages;
DROP POLICY IF EXISTS "messages_insert" ON public.messages;

CREATE POLICY "messages_select"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tickets t
      WHERE t.id = messages.ticket_id
        AND (
          t.employee_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'technician'
          )
        )
    )
  );

CREATE POLICY "messages_insert"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.tickets t
      WHERE t.id = ticket_id
        AND (
          t.employee_id = auth.uid()
          OR t.technician_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'technician'
          )
        )
    )
  );


-- ======================================================
-- 4. FAQ ARTICLES
-- ======================================================
CREATE TABLE IF NOT EXISTS public.faq_articles (
  id          bigint      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title       text        NOT NULL,
  content     text        NOT NULL,
  category    text,
  created_by  uuid        REFERENCES public.profiles(id),
  is_public   boolean     DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.faq_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "faq_select_public" ON public.faq_articles;
DROP POLICY IF EXISTS "faq_insert_technician" ON public.faq_articles;
DROP POLICY IF EXISTS "faq_update_own" ON public.faq_articles;
DROP POLICY IF EXISTS "faq_delete_own" ON public.faq_articles;

CREATE POLICY "faq_select_public"
  ON public.faq_articles FOR SELECT
  TO authenticated
  USING (is_public = true OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'technician'
  ));

CREATE POLICY "faq_insert_technician"
  ON public.faq_articles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'technician'
    )
    AND created_by = auth.uid()
  );

CREATE POLICY "faq_update_own"
  ON public.faq_articles FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "faq_delete_own"
  ON public.faq_articles FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());


-- ======================================================
-- 5. FEEDBACK
-- ======================================================
CREATE TABLE IF NOT EXISTS public.feedback (
  id          bigint      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  ticket_id   uuid        REFERENCES public.tickets(id) UNIQUE,
  rating      int         CHECK (rating BETWEEN 1 AND 5),
  comment     text,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "feedback_insert_employee" ON public.feedback;
DROP POLICY IF EXISTS "feedback_select" ON public.feedback;

CREATE POLICY "feedback_insert_employee"
  ON public.feedback FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tickets t
      WHERE t.id = ticket_id
        AND t.employee_id = auth.uid()
        AND t.status = 'resolved'
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.feedback f2
      WHERE f2.ticket_id = ticket_id
    )
  );

CREATE POLICY "feedback_select"
  ON public.feedback FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tickets t
      WHERE t.id = feedback.ticket_id
        AND (
          t.employee_id = auth.uid()
          OR t.technician_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'technician'
          )
        )
    )
  );


-- ======================================================
-- 6. STORAGE BUCKET: screenshots
-- ======================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('screenshots', 'screenshots', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "screenshots_upload_employee" ON storage.objects;
DROP POLICY IF EXISTS "screenshots_read_all" ON storage.objects;
DROP POLICY IF EXISTS "screenshots_delete_employee" ON storage.objects;

-- Allow any authenticated user to read screenshots (necessary for technicians to see client screenshots)
CREATE POLICY "screenshots_read_all"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'screenshots');

CREATE POLICY "screenshots_upload_employee"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'screenshots'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ======================================================
-- 7. STORAGE BUCKET: avatars
-- ======================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "avatars_read_all" ON storage.objects;
DROP POLICY IF EXISTS "avatars_upload_own" ON storage.objects;

CREATE POLICY "avatars_read_all"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_upload_own"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "screenshots_delete_employee"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'screenshots'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );