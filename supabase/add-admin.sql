-- ============================================================
-- VORTKART ADMIN USER SETUP
-- Run supabase/setup.sql first.
-- Then create the user in Supabase > Authentication > Users.
-- Replace the email below with that exact user's email and Run.
-- ============================================================

do $$
declare
  admin_email text := 'YOUR_ADMIN_EMAIL@example.com';
  matched_user_id uuid;
begin
  if admin_email = 'YOUR_ADMIN_EMAIL@example.com' then
    raise exception 'Replace YOUR_ADMIN_EMAIL@example.com with your real admin email before running this script.';
  end if;

  select id into matched_user_id
  from auth.users
  where lower(email) = lower(admin_email)
  limit 1;

  if matched_user_id is null then
    raise exception 'No Supabase Auth user found for email: %. Create the user in Authentication > Users first.', admin_email;
  end if;

  insert into public.admin_users (user_id, email)
  values (matched_user_id, admin_email)
  on conflict (user_id) do update set email = excluded.email;
end $$;

select email, created_at
from public.admin_users
order by created_at desc;
