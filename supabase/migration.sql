-- MealManager / family-meals
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query)

-- 1. Category enum
create type food_category as enum ('main', 'side', 'produce', 'drink', 'snack');

-- 2. Tables

create table families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table children (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  name text not null,
  avatar_emoji text not null default '👦',
  color text not null default '#4ECDC4',
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create table food_items (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  name text not null,
  emoji text not null default '🍽️',
  category food_category not null default 'main',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table daily_choices (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  child_id uuid not null references children(id) on delete cascade,
  choice_date date not null default current_date,
  is_completed boolean not null default false,
  created_at timestamptz not null default now(),
  unique (child_id, choice_date)
);

create table daily_choice_items (
  id uuid primary key default gen_random_uuid(),
  daily_choice_id uuid not null references daily_choices(id) on delete cascade,
  food_item_id uuid not null references food_items(id) on delete cascade
);

-- 3. Indexes

create index idx_children_family on children(family_id);
create index idx_food_items_family on food_items(family_id);
create index idx_daily_choices_family_date on daily_choices(family_id, choice_date);
create index idx_daily_choices_child_date on daily_choices(child_id, choice_date);
create index idx_daily_choice_items_choice on daily_choice_items(daily_choice_id);

-- 4. Row Level Security

alter table families enable row level security;
alter table children enable row level security;
alter table food_items enable row level security;
alter table daily_choices enable row level security;
alter table daily_choice_items enable row level security;

-- Helper: get the family_id for the current user
create or replace function auth_family_id()
returns uuid
language sql
stable
security definer
as $$
  select id from families where owner_id = auth.uid() limit 1;
$$;

-- families: owner can do everything
create policy "families_select" on families
  for select using (owner_id = auth.uid());

create policy "families_insert" on families
  for insert with check (owner_id = auth.uid());

create policy "families_update" on families
  for update using (owner_id = auth.uid());

create policy "families_delete" on families
  for delete using (owner_id = auth.uid());

-- children: family owner can do everything
create policy "children_select" on children
  for select using (family_id = auth_family_id());

create policy "children_insert" on children
  for insert with check (family_id = auth_family_id());

create policy "children_update" on children
  for update using (family_id = auth_family_id());

create policy "children_delete" on children
  for delete using (family_id = auth_family_id());

-- food_items: family owner can do everything
create policy "food_items_select" on food_items
  for select using (family_id = auth_family_id());

create policy "food_items_insert" on food_items
  for insert with check (family_id = auth_family_id());

create policy "food_items_update" on food_items
  for update using (family_id = auth_family_id());

create policy "food_items_delete" on food_items
  for delete using (family_id = auth_family_id());

-- daily_choices: family owner can do everything
create policy "daily_choices_select" on daily_choices
  for select using (family_id = auth_family_id());

create policy "daily_choices_insert" on daily_choices
  for insert with check (family_id = auth_family_id());

create policy "daily_choices_update" on daily_choices
  for update using (family_id = auth_family_id());

create policy "daily_choices_delete" on daily_choices
  for delete using (family_id = auth_family_id());

-- daily_choice_items: access through daily_choices
create policy "daily_choice_items_select" on daily_choice_items
  for select using (
    exists (
      select 1 from daily_choices
      where daily_choices.id = daily_choice_items.daily_choice_id
        and daily_choices.family_id = auth_family_id()
    )
  );

create policy "daily_choice_items_insert" on daily_choice_items
  for insert with check (
    exists (
      select 1 from daily_choices
      where daily_choices.id = daily_choice_items.daily_choice_id
        and daily_choices.family_id = auth_family_id()
    )
  );

create policy "daily_choice_items_delete" on daily_choice_items
  for delete using (
    exists (
      select 1 from daily_choices
      where daily_choices.id = daily_choice_items.daily_choice_id
        and daily_choices.family_id = auth_family_id()
    )
  );

-- 5. Enable Realtime for dashboard live updates
alter publication supabase_realtime add table daily_choices;
alter publication supabase_realtime add table daily_choice_items;
