-- Knowledge Base schema for Supabase

create table if not exists knowledge_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  icon text,
  created_at timestamptz default now()
);

create table if not exists knowledge_articles (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references knowledge_categories(id) on delete cascade,
  title text not null,
  author text,
  publish_date date,
  last_updated date,
  read_time text,
  difficulty text check (difficulty in ('beginner','intermediate','advanced')),
  rating numeric,
  views integer default 0,
  tags text[] default '{}',
  content text not null,
  featured boolean default false,
  created_at timestamptz default now()
);

create or replace view knowledge_articles_view as
  select a.*, c.slug as category_slug, c.name as category_name
  from knowledge_articles a
  join knowledge_categories c on c.id = a.category_id;

-- Seed VeroSuite category and starter articles
insert into knowledge_categories (slug, name, description, icon)
values
  ('verosuite-training', 'VeroSuite Training', 'Learn how to use the VeroSuite CRM effectively', '🎓')
on conflict (slug) do nothing;

-- Insert articles only if not exist by title
with cat as (
  select id from knowledge_categories where slug = 'verosuite-training' limit 1
)
insert into knowledge_articles (category_id, title, author, publish_date, last_updated, read_time, difficulty, rating, tags, content, featured)
select cat.id, 'VeroSuite: Getting Started', 'VeroSuite Team', current_date, current_date, '6 min', 'beginner', 4.9, array['onboarding','setup','account'],
$$Create your account, understand the layout, and complete the initial setup to start using VeroSuite.

Topics:
- Logging in and user roles
- Dashboard overview
- Updating company settings and branding
- Keyboard shortcuts (press ? to view)
$$, true from cat
where not exists (select 1 from knowledge_articles where title = 'VeroSuite: Getting Started');

with cat as (
  select id from knowledge_categories where slug = 'verosuite-training' limit 1
)
insert into knowledge_articles (category_id, title, author, publish_date, last_updated, read_time, difficulty, rating, tags, content, featured)
select cat.id, 'Navigating VeroSuite: Dashboard, Customers, Jobs', 'VeroSuite Team', current_date, current_date, '8 min', 'beginner', 4.8, array['navigation','dashboard','customers','jobs'],
$$Learn the main sections of VeroSuite and how to move quickly using the sidebar and keyboard shortcuts.

Topics:
- Sidebar and top bar
- Customers: create, view, search
- Jobs: scheduling basics
- Reports and Analytics
$$, false from cat
where not exists (select 1 from knowledge_articles where title = 'Navigating VeroSuite: Dashboard, Customers, Jobs');

with cat as (
  select id from knowledge_categories where slug = 'verosuite-training' limit 1
)
insert into knowledge_articles (category_id, title, author, publish_date, last_updated, read_time, difficulty, rating, tags, content, featured)
select cat.id, 'Quick Commands: Natural Language Actions', 'VeroSuite Team', current_date, current_date, '7 min', 'beginner', 4.7, array['commands','nlp','productivity'],
$$Use the command bar to type natural language like "create new customer Chris Seek 134 Thompson Ave Donora PA 15033" to auto-fill forms.

Tips:
- Include address, city, state, zip, phone, email where possible
- Use commas or spaces; the parser supports both
- Review parsed data before saving
$$, false from cat
where not exists (select 1 from knowledge_articles where title = 'Quick Commands: Natural Language Actions');




