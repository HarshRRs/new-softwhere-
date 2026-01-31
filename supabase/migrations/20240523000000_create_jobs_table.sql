create table public.jobs (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  title text not null,
  company text not null,
  location text null,
  salary text null,
  url text not null,
  description text null,
  status text not null default 'new'::text,
  user_id uuid not null default auth.uid (),
  constraint jobs_pkey primary key (id),
  constraint jobs_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
) tablespace pg_default;
