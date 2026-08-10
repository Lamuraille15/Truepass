-- ====================================================================
-- TruePass MVP V1 — schéma Supabase
-- À exécuter dans : Supabase → SQL Editor (projet neuf recommandé)
-- ====================================================================

-- on s'assure que pgcrypto est dispo (pour gen_random_uuid)
create extension if not exists "pgcrypto";

-- ---------- Trigger qui crée automatiquement le profil à l'inscription
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  final_username text;
begin
  base_username := lower(coalesce(new.email, 'user'));
  base_username := regexp_replace(split_part(base_username, '@', 1), '[^a-z0-9._-]', '', 'g');
  if length(base_username) < 3 then
    base_username := 'user' || substr(replace(new.id::text, '-', ''), 1, 6);
  end if;
  final_username := base_username;
  while exists (select 1 from public.profiles where username = final_username) loop
    final_username := base_username || floor(random() * 9000 + 1000)::text;
  end loop;

  insert into public.profiles (user_id, username, first_name)
  values (new.id, final_username, null);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Tables
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  username text not null unique,
  first_name text,
  last_name text,
  job_title text,
  bio text,
  location text,
  photo_url text,
  phone text,
  website text,
  linkedin text,
  github text,
  updated_at timestamptz default now()
);
create index if not exists idx_profiles_username on public.profiles (username);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  skill text not null,
  created_at timestamptz default now()
);
create index if not exists idx_skills_profile on public.skills (profile_id);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  position text not null,
  company text not null,
  description text,
  start_date date,
  end_date date
);
create index if not exists idx_exp_profile on public.experiences (profile_id);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  school text not null,
  degree text not null,
  year text
);
create index if not exists idx_edu_profile on public.education (profile_id);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  image_url text,
  url text,
  created_at timestamptz default now()
);
create index if not exists idx_proj_profile on public.projects (profile_id);

-- ---------- RLS : profils publics (lecture), écritures par le propriétaire
alter table public.profiles     enable row level security;
alter table public.skills       enable row level security;
alter table public.experiences  enable row level security;
alter table public.education    enable row level security;
alter table public.projects     enable row level security;

-- profiles
drop policy if exists "profiles_read_public"   on public.profiles;
drop policy if exists "profiles_insert_self"  on public.profiles;
drop policy if exists "profiles_update_self"  on public.profiles;
drop policy if exists "profiles_delete_self"  on public.profiles;
create policy "profiles_read_public"
  on public.profiles for select using (true);
create policy "profiles_insert_self"
  on public.profiles for insert with check (auth.uid() = user_id);
create policy "profiles_update_self"
  on public.profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "profiles_delete_self"
  on public.profiles for delete using (auth.uid() = user_id);

-- skills / experiences / education / projects
do $$
declare t text;
begin
  foreach t in array array['skills','experiences','education','projects'] loop
    execute format('drop policy if exists "%s_read_public"  on public.%I', t, t);
    execute format('drop policy if exists "%s_write_self"  on public.%I', t, t);
    execute format('drop policy if exists "%s_update_self" on public.%I', t, t);
    execute format('drop policy if exists "%s_delete_self" on public.%I', t, t);

    execute format(
      'create policy "%s_read_public" on public.%I for select using (true)', t, t);

    execute format(
      'create policy "%s_write_self" on public.%I for insert with check (
         exists (select 1 from public.profiles p
                 where p.id = %I.profile_id and p.user_id = auth.uid())
       )', t, t, t);

    execute format(
      'create policy "%s_update_self" on public.%I for update using (
         exists (select 1 from public.profiles p
                 where p.id = %I.profile_id and p.user_id = auth.uid())
       ) with check (
         exists (select 1 from public.profiles p
                 where p.id = %I.profile_id and p.user_id = auth.uid())
       )', t, t, t, t);

    execute format(
      'create policy "%s_delete_self" on public.%I for delete using (
         exists (select 1 from public.profiles p
                 where p.id = %I.profile_id and p.user_id = auth.uid())
       )', t, t, t);
  end loop;
end $$;

-- ---------- Storage : buckets "avatars" et "project-images" (publics en lecture)
-- À faire manuellement dans Supabase Storage OU via :
insert into storage.buckets (id, name, public)
values ('avatars','avatars', true)
on conflict (id) do nothing;
insert into storage.buckets (id, name, public)
values ('project-images','project-images', true)
on conflict (id) do nothing;

-- Policies Storage : un user ne peut écrire que son propre dossier (préfixe = user_id dans "avatars",
-- ou profile_id dans "project-images").
drop policy if exists "avatars_read_public"     on storage.objects;
drop policy if exists "avatars_write_owner"    on storage.objects;
drop policy if exists "projectimg_read_public" on storage.objects;
drop policy if exists "projectimg_write_owner" on storage.objects;

create policy "avatars_read_public"     on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars_write_owner"    on storage.objects for insert with check (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy "projectimg_read_public" on storage.objects for select using (bucket_id = 'project-images');
create policy "projectimg_write_owner" on storage.objects for insert with check (
  bucket_id = 'project-images' and (storage.foldername(name))[1] is not null
);
-- updates/deletes pour le propriétaire
drop policy if exists "avatars_modify_owner"    on storage.objects;
drop policy if exists "projectimg_modify_owner" on storage.objects;
create policy "avatars_modify_owner"    on storage.objects for all using (
  bucket_id = 'avatars'    and (storage.foldername(name))[1] = auth.uid()::text
) with check (
  bucket_id = 'avatars'    and (storage.foldername(name))[1] = auth.uid()::text
);
create policy "projectimg_modify_owner" on storage.objects for all using (
  bucket_id = 'project-images' and (storage.foldername(name))[1] is not null
) with check (
  bucket_id = 'project-images' and (storage.foldername(name))[1] is not null
);
