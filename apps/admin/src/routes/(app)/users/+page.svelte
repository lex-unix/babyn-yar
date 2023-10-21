<script lang="ts">
  import {
    Table,
    TableHeader,
    TableRow,
    TableData,
    DeleteAlertDialog,
    RegisterUserDialog
  } from '$components'
  import type { User } from '$lib/types'
  import { admin } from '$lib/stores'
  import { onMount } from 'svelte'
  import { formatDate } from '$lib'
  import { Trash } from 'lucide-svelte'
  import { deleteUsers } from '$lib'
  import { addToast } from '$components/Toaster.svelte'

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

  function clear() {
    selectedUsers = []
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
    }
  }
</script>

<svelte:head>
  <title>Управління користувачами</title>
</svelte:head>
{#if $admin}
  <div class="flex w-full items-center justify-between">
    <h1 class="text-2xl font-semibold">Управління користувачами</h1>
    {#if $admin}
      <RegisterUserDialog on:register={addUser} />
    {/if}
  </div>

  {#if selectedUsers.length > 0}
    <div class="-mb-4 mt-6">
      <div
        class="w-full rounded-md bg-gray-800 text-sm font-normal text-gray-100"
      >
        <div class="px-3 py-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <p>Обрано {selectedUsers.length}</p>
              <button
                on:click={clear}
                class="rounded-md px-3 py-2 hover:bg-white/10"
              >
                Очистити
              </button>
            </div>
            <div class="flex items-center justify-center gap-4">
              <button
                on:click={() => alertDialog.openAlertDialog()}
                class="inline-flex items-center justify-center rounded-md p-2 hover:bg-white/20"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}

  {#if users.length > 0}
    <div class="mt-10">
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
            <TableHeader>Користувач</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Дата реєстрації</TableHeader>
            <TableHeader>Дозволи</TableHeader>
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
    </div>
  {/if}

  <DeleteAlertDialog bind:this={alertDialog} on:confirm={deleteSelected} />
{:else}
  <div class="flex h-full flex-col items-center justify-center text-center">
    <h1 class="text-xl font-semibold">У вас не має доступа до цієї сторінки</h1>
    <p class="mt-2 text-gray-400">
      Для доступа до цієї сторіни потрібно мати права адміністратора
    </p>
  </div>
{/if}
