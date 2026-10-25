-- Friend requests need a phone number on file.

drop policy if exists "send friend request" on public.friendships;
create policy "send friend request" on public.friendships for insert to authenticated
  with check (
    requester_id = auth.uid()
    and status = 'pending'
    and exists (select 1 from public.profile_contacts c where c.user_id = auth.uid())
  );
