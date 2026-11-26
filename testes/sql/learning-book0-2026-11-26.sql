-- REPRODUÇÃO DO ESQUEMA DE TESTES, 26/11/2026. NÃO APLICAR NA PRODUÇÃO.
-- O script requer as tabelas public.students e public.organization_members já configuradas.
create table if not exists public.learning_projects(
id uuid primary key default gen_random_uuid(),
organization_id uuid not null,student_id uuid not null,
origin_key text not null check(length(origin_key) between 1 and 150),
origin_book_id text,area_id text check(area_id is null or length(area_id)<=40),
title text not null check(length(title) between 1 and 150),
created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
constraint learning_projects_student_fk foreign key(organization_id,student_id) references public.students(organization_id,id),
constraint learning_projects_origin_uniq unique(organization_id,student_id,origin_key),
constraint learning_projects_composite_uniq unique(id,organization_id,student_id)
);
create table if not exists public.learning_tasks(
id uuid primary key default gen_random_uuid(),
organization_id uuid not null,student_id uuid not null,project_id uuid not null,
source_task_key text not null check(length(source_task_key) between 1 and 120),
title text not null check(length(title) between 1 and 180),
status text not null default 'backlog' check(status in ('backlog','today','done')),
position integer not null default 0 check(position>=0),
created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
constraint learning_tasks_project_fk foreign key(project_id,organization_id,student_id)
 references public.learning_projects(id,organization_id,student_id) on delete cascade,
constraint learning_tasks_source_uniq unique(project_id,source_task_key)
);
create table if not exists public.learning_book_records(
id uuid primary key default gen_random_uuid(),
organization_id uuid not null,student_id uuid not null,
book_id text not null check(length(book_id) between 1 and 140),
book_version text not null check(length(book_version) between 1 and 60),
payload jsonb not null default '{}'::jsonb check(jsonb_typeof(payload)='object' and octet_length(payload::text)<=65536),
updated_at timestamptz not null default now(),
constraint learning_book_records_student_fk foreign key(organization_id,student_id) references public.students(organization_id,id),
constraint learning_book_records_book_uniq unique(organization_id,student_id,book_id)
);

alter table public.learning_projects enable row level security;
revoke all on public.learning_projects from anon, authenticated;
grant select,insert,update,delete on public.learning_projects to authenticated;
create policy learning_projects_student_select on public.learning_projects for select to authenticated using (exists (select 1 from public.students s join public.organization_members m
 on m.organization_id=s.organization_id and m.user_id=s.auth_user_id
 where s.id=public.learning_projects.student_id and s.organization_id=public.learning_projects.organization_id
 and s.auth_user_id=(select auth.uid()) and s.active and m.approved and m.role='student'));
create policy learning_projects_student_insert on public.learning_projects for insert to authenticated with check (exists (select 1 from public.students s join public.organization_members m
 on m.organization_id=s.organization_id and m.user_id=s.auth_user_id
 where s.id=public.learning_projects.student_id and s.organization_id=public.learning_projects.organization_id
 and s.auth_user_id=(select auth.uid()) and s.active and m.approved and m.role='student'));
create policy learning_projects_student_update on public.learning_projects for update to authenticated using (exists (select 1 from public.students s join public.organization_members m
 on m.organization_id=s.organization_id and m.user_id=s.auth_user_id
 where s.id=public.learning_projects.student_id and s.organization_id=public.learning_projects.organization_id
 and s.auth_user_id=(select auth.uid()) and s.active and m.approved and m.role='student')) with check (exists (select 1 from public.students s join public.organization_members m
 on m.organization_id=s.organization_id and m.user_id=s.auth_user_id
 where s.id=public.learning_projects.student_id and s.organization_id=public.learning_projects.organization_id
 and s.auth_user_id=(select auth.uid()) and s.active and m.approved and m.role='student'));
create policy learning_projects_student_delete on public.learning_projects for delete to authenticated using (exists (select 1 from public.students s join public.organization_members m
 on m.organization_id=s.organization_id and m.user_id=s.auth_user_id
 where s.id=public.learning_projects.student_id and s.organization_id=public.learning_projects.organization_id
 and s.auth_user_id=(select auth.uid()) and s.active and m.approved and m.role='student'));

alter table public.learning_tasks enable row level security;
revoke all on public.learning_tasks from anon, authenticated;
grant select,insert,update,delete on public.learning_tasks to authenticated;
create policy learning_tasks_student_select on public.learning_tasks for select to authenticated using (exists (select 1 from public.students s join public.organization_members m
 on m.organization_id=s.organization_id and m.user_id=s.auth_user_id
 where s.id=public.learning_tasks.student_id and s.organization_id=public.learning_tasks.organization_id
 and s.auth_user_id=(select auth.uid()) and s.active and m.approved and m.role='student'));
create policy learning_tasks_student_insert on public.learning_tasks for insert to authenticated with check (exists (select 1 from public.students s join public.organization_members m
 on m.organization_id=s.organization_id and m.user_id=s.auth_user_id
 where s.id=public.learning_tasks.student_id and s.organization_id=public.learning_tasks.organization_id
 and s.auth_user_id=(select auth.uid()) and s.active and m.approved and m.role='student'));
create policy learning_tasks_student_update on public.learning_tasks for update to authenticated using (exists (select 1 from public.students s join public.organization_members m
 on m.organization_id=s.organization_id and m.user_id=s.auth_user_id
 where s.id=public.learning_tasks.student_id and s.organization_id=public.learning_tasks.organization_id
 and s.auth_user_id=(select auth.uid()) and s.active and m.approved and m.role='student')) with check (exists (select 1 from public.students s join public.organization_members m
 on m.organization_id=s.organization_id and m.user_id=s.auth_user_id
 where s.id=public.learning_tasks.student_id and s.organization_id=public.learning_tasks.organization_id
 and s.auth_user_id=(select auth.uid()) and s.active and m.approved and m.role='student'));
create policy learning_tasks_student_delete on public.learning_tasks for delete to authenticated using (exists (select 1 from public.students s join public.organization_members m
 on m.organization_id=s.organization_id and m.user_id=s.auth_user_id
 where s.id=public.learning_tasks.student_id and s.organization_id=public.learning_tasks.organization_id
 and s.auth_user_id=(select auth.uid()) and s.active and m.approved and m.role='student'));

alter table public.learning_book_records enable row level security;
revoke all on public.learning_book_records from anon, authenticated;
grant select,insert,update,delete on public.learning_book_records to authenticated;
create policy learning_book_records_student_select on public.learning_book_records for select to authenticated using (exists (select 1 from public.students s join public.organization_members m
 on m.organization_id=s.organization_id and m.user_id=s.auth_user_id
 where s.id=public.learning_book_records.student_id and s.organization_id=public.learning_book_records.organization_id
 and s.auth_user_id=(select auth.uid()) and s.active and m.approved and m.role='student'));
create policy learning_book_records_student_insert on public.learning_book_records for insert to authenticated with check (exists (select 1 from public.students s join public.organization_members m
 on m.organization_id=s.organization_id and m.user_id=s.auth_user_id
 where s.id=public.learning_book_records.student_id and s.organization_id=public.learning_book_records.organization_id
 and s.auth_user_id=(select auth.uid()) and s.active and m.approved and m.role='student'));
create policy learning_book_records_student_update on public.learning_book_records for update to authenticated using (exists (select 1 from public.students s join public.organization_members m
 on m.organization_id=s.organization_id and m.user_id=s.auth_user_id
 where s.id=public.learning_book_records.student_id and s.organization_id=public.learning_book_records.organization_id
 and s.auth_user_id=(select auth.uid()) and s.active and m.approved and m.role='student')) with check (exists (select 1 from public.students s join public.organization_members m
 on m.organization_id=s.organization_id and m.user_id=s.auth_user_id
 where s.id=public.learning_book_records.student_id and s.organization_id=public.learning_book_records.organization_id
 and s.auth_user_id=(select auth.uid()) and s.active and m.approved and m.role='student'));
create policy learning_book_records_student_delete on public.learning_book_records for delete to authenticated using (exists (select 1 from public.students s join public.organization_members m
 on m.organization_id=s.organization_id and m.user_id=s.auth_user_id
 where s.id=public.learning_book_records.student_id and s.organization_id=public.learning_book_records.organization_id
 and s.auth_user_id=(select auth.uid()) and s.active and m.approved and m.role='student'));
