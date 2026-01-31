create table public.applications (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  job_title text not null,
  company text not null,
  status text not null default 'applied'::text, -- saved, applied, interviewing, offer, rejected
  cover_letter text null,
  job_url text null,
  notes text null,
  user_id uuid not null default auth.uid (),
  constraint applications_pkey primary key (id),
  constraint applications_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
) tablespace pg_default;
