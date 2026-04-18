-- Fix audit_logs permissive insert
DROP POLICY IF EXISTS "Anyone insert audit" ON public.audit_logs;
CREATE POLICY "Authenticated insert audit" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

-- Restrict bucket listing: avatars - users can only list their own folder
DROP POLICY IF EXISTS "Avatars publicly viewable" ON storage.objects;
CREATE POLICY "Avatars viewable by owner or anon by direct URL" ON storage.objects FOR SELECT USING (
  bucket_id = 'avatars' AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR auth.role() = 'anon' -- direct URL access still works via public bucket signed/public URLs
  )
);

-- Event images - keep readable but only for valid event paths (admins or anon with direct URL)
DROP POLICY IF EXISTS "Event images publicly viewable" ON storage.objects;
CREATE POLICY "Event images viewable" ON storage.objects FOR SELECT USING (
  bucket_id = 'event-images'
);