-- Save the phone number given at sign-up, when it is valid.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  phone_value text := nullif(trim(coalesce(new.raw_user_meta_data ->> 'phone', '')), '');
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;

  if phone_value is not null and phone_value ~ '^\+?[0-9]{10,15}$' then
    insert into public.profile_contacts (user_id, phone)
    values (new.id, phone_value)
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;
