-- ====================================================================
-- truepass — schéma Supabase
-- ====================================================================
create extension if not exists "pgcrypto";

-- Trigger : crée automatiquement un profil à chaque inscription
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare base_username text; final_username text;
begin
  base_username := lower(coalesce(new.email, 'user'));
  base_username := regexp_replace(split_part(base_username, '@', 1), '[^a-z0-9._-]', '', 'g');
  if length(base_username) < 3 then base_username := 'user' || substr(replace(new.id::text, '-', ''), 1, 6); end if;
  final_username := base_username;
  while exists (select 1 from public.profiles where username = final_username) loop
    final_username := base_username || floor(random() * 9000 + 1000)::text;
  end loop;
  insert into public.profiles (user_id, username) values (new.id, final_username);
  insert into public.trustlink_config (user_id, username) values (new.id, final_username);
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Tables
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  username text not null unique,
  first_name text, last_name text, job_title text, bio text,
  location text, photo_url text, phone text, website text,
  linkedin text, github text, updated_at timestamptz default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  skill text not null, created_at timestamptz default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  position text not null, company text not null, description text,
  start_date date, end_date date
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  school text not null, degree text not null, year text
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null, description text, image_url text, url text,
  created_at timestamptz default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  author text not null, content text not null, rating int not null default 5,
  created_at timestamptz default now()
);

create table if not exists public.trustlink_config (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  username text not null,
  expires_in_days int not null default 30,
  password_protected bool not null default false,
  show_info bool not null default true,
  show_skills bool not null default true,
  show_projects bool not null default true,
  show_experiences bool not null default true,
  show_documents bool not null default false,
  show_testimonials bool not null default false,
  updated_at timestamptz default now()
);

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null, created_at timestamptz default now()
);

-- RLS : lecture publique des profils, écritures par le propriétaire
alter table public.profiles       enable row level security;
alter table public.skills         enable row level security;
alter table public.experiences    enable row level security;
alter table public.education      enable row level security;
alter table public.projects       enable row level security;
alter table public.testimonials   enable row level security;
alter table public.trustlink_config enable row level security;
alter table public.activity_log   enable row level security;

create policy "profiles_read_public"  on public.profiles      for select using (true);
create policy "profiles_write_self"   on public.profiles      for insert with check (auth.uid() = user_id);
create policy "profiles_update_self"  on public.profiles      for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "profiles_delete_self"  on public.profiles      for delete using (auth.uid() = user_id);

do $$
declare t text;
begin
  foreach t in array array['skills','experiences','education','projects','testimonials'] loop
    execute format('drop policy if exists "%s_read_public" on public.%I', t, t);
    execute format('drop policy if exists "%s_write_self" on public.%I', t, t);
    execute format('drop policy if exists "%s_update_self" on public.%I', t, t);
    execute format('drop policy if exists "%s_delete_self" on public.%I', t, t);
    execute format('create policy "%s_read_public" on public.%I for select using (true)', t, t);
    execute format('create policy "%s_write_self" on public.%I for insert with check (exists (select 1 from public.profiles p where p.id = %I.profile_id and p.user_id = auth.uid()))', t, t, t);
    execute format('create policy "%s_update_self" on public.%I for update using (exists (select 1 from public.profiles p where p.id = %I.profile_id and p.user_id = auth.uid())) with check (exists (select 1 from public.profiles p where p.id = %I.profile_id and p.user_id = auth.uid()))', t, t, t, t);
    execute format('create policy "%s_delete_self" on public.%I for delete using (exists (select 1 from public.profiles p where p.id = %I.profile_id and p.user_id = auth.uid()))', t, t, t);
  end loop;
end $$;

create policy "trustlink_self" on public.trustlink_config
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "trustlink_read_public" on public.trustlink_config for select using (true);

create policy "activity_self" on public.activity_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Storage (avatars + project images)
insert into storage.buckets (id, name, public) values ('avatars','avatars', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('project-images','project-images', true) on conflict (id) do nothing;

drop policy if exists "avatars_read_public"     on storage.objects;
drop policy if exists "avatars_write_owner"    on storage.objects;
drop policy if exists "projectimg_read_public" on storage.objects;
drop policy if exists "projectimg_write_owner" on storage.objects;

create policy "avatars_read_public"     on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars_write_owner"    on storage.objects for insert with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "projectimg_read_public" on storage.objects for select using (bucket_id = 'project-images');
create policy "projectimg_write_owner" on storage.objects for insert with check (bucket_id = 'project-images' and (storage.foldername(name))[1] is not null);
