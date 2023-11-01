<script lang="ts">
  import {
    Table,
    TableHeader,
    TableRow,
    TableData,
    DeleteAlertDialog,
    RegisterUserDialog,
    PageHeader,
    Container,
    RecordActionBar
  } from '$components'
  import type { User } from '$lib/types'
  import { admin } from '$lib/stores'
  import { onMount } from 'svelte'
  import { deleteUsers, formatDate } from '$lib'
  import { addToast } from '$components/Toaster.svelte'
  import { UserIcon, AtSignIcon, CalendarIcon, KeyIcon } from 'lucide-svelte'

  let users: User[] = []
  let selectedUsers: number[] = []
  let alertDialog: DeleteAlertDialog

  onMount(async () => {
    if ($admin) {
      const res = await fetch('http://localhost:8000/v1/users', {
        credentials: 'include'
      })
      const json = await res.json()
      users = json.users
    }
  })

  function addUser(e: CustomEvent<{ user: User }>) {
    const { user } = e.detail
    users = [user, ...users]
  }

  function toggleSelect(id: number) {
    if (selectedUsers.includes(id)) {
      selectedUsers = selectedUsers.filter(e => e !== id)
    } else {
      selectedUsers = [...selectedUsers, id]
    }
  }

  function toggleSelectAll() {
    if (selectedUsers.length === users.length) {
      selectedUsers = []
    } else {
      selectedUsers = users.map(e => e.id)
    }
  }

  async function deleteSelected() {
    const { ok } = await deleteUsers(selectedUsers)
    if (ok) {
      users = users.filter(u => !selectedUsers.includes(u.id))
      selectedUsers = []
      addToast({
        data: {
          title: 'Операція успішна',
          description: 'Користувачі були видалені',
          color: 'bg-emerald-400'
        }
      })
      alertDialog.dismiss()
    }
  }
</script>

{#if $admin}
  <PageHeader>
    <svelte:fragment slot="heading">Користувачі</svelte:fragment>
    <RegisterUserDialog slot="right-items" on:register={addUser} />
  </PageHeader>

  <Container title="Управління користувачами">
    <RecordActionBar
      bind:selected={selectedUsers}
      on:delete={() => alertDialog.show()}
    />

    {#if users.length > 0}
      <Table>
        <thead>
          <tr>
            <TableHeader>
              <input
                type="checkbox"
                checked={selectedUsers.length > 0 &&
                  selectedUsers.length === users.length}
                on:input={toggleSelectAll}
              />
            </TableHeader>
            <TableHeader>
              <div class="inline-flex items-center gap-2">
                <UserIcon size={16} />
                <span>Користувач</span>
              </div>
            </TableHeader>
            <TableHeader>
              <div class="inline-flex items-center gap-2">
                <AtSignIcon size={16} />
                <span>Email</span>
              </div>
            </TableHeader>
            <TableHeader>
              <div class="inline-flex items-center gap-2">
                <CalendarIcon size={16} />
                <span>Дата реєстрації</span>
              </div>
            </TableHeader>
            <TableHeader>
              <div class="inline-flex items-center gap-2">
                <KeyIcon size={16} />
                <span>Дозволи</span>
              </div>
            </TableHeader>
          </tr>
        </thead>
        <tbody>
          {#each users as user}
            <TableRow>
              <TableData>
                <input
                  type="checkbox"
                  on:input={() => toggleSelect(user.id)}
                  checked={selectedUsers.includes(user.id)}
                />
              </TableData>
              <TableData>{user.fullName}</TableData>
              <TableData>{user.email}</TableData>
              <TableData>{formatDate(user.createdAt)}</TableData>
              <TableData>{user.permissions.join(', ')}</TableData>
            </TableRow>
          {/each}
        </tbody>
      </Table>
    {/if}
  </Container>

  <DeleteAlertDialog bind:this={alertDialog} on:confirm={deleteSelected} />
{:else}
  <div class="flex h-full flex-col items-center justify-center text-center">
    <h1 class="text-xl font-semibold">У вас не має доступа до цієї сторінки</h1>
    <p class="mt-2 text-gray-400">
      Для доступа до цієї сторіни потрібно мати права адміністратора
    </p>
  </div>
{/if}
