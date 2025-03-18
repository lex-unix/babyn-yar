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
    RecordActionBar,
    TableSkeleton,
    Pagination
  } from '$components'
  import { UserIcon, AtSignIcon, CalendarIcon, KeyIcon } from 'lucide-svelte'
  import { formatDate } from '$lib/format-date'
  import { useUsers, useDeleteUsers } from '$lib/users/query'
  import { updateFilter, updateFilters } from '$lib/url-params'
  import { isAdmin } from '$lib/auth/store'

  let selectedUsers: number[] = []
  let alertDialog: DeleteAlertDialog

  const users = useUsers()
  const deleteUsers = useDeleteUsers()

  function toggleSelect(id: number) {
    if (selectedUsers.includes(id)) {
      selectedUsers = selectedUsers.filter(e => e !== id)
    } else {
      selectedUsers = [...selectedUsers, id]
    }
  }

  function toggleSelectAll() {
    if ($users.isSuccess) {
      if (selectedUsers.length === $users.data.users.length) {
        selectedUsers = []
      } else {
        selectedUsers = $users.data.users.map(e => e.id)
      }
    }
  }

  async function deleteSelected() {
    $deleteUsers.mutate(selectedUsers, {
      onSuccess: () => {
        selectedUsers = []
        alertDialog.dismiss()
      }
    })
  }

  function selectPage(e: CustomEvent<{ page: number }>) {
    updateFilter('page', e.detail.page)
  }

  function selectPageSize(e: CustomEvent<{ size: number }>) {
    updateFilters({ page: 1, page_size: e.detail.size })
  }
</script>

{#if $isAdmin}
  <PageHeader>
    <svelte:fragment slot="heading">Користувачі</svelte:fragment>
    <RegisterUserDialog slot="right-items" />
  </PageHeader>

  <Container title="Управління користувачами">
    <RecordActionBar
      bind:selected={selectedUsers}
      on:delete={() => alertDialog.show()}
    />

    {#if $users.isLoading}
      <TableSkeleton />
    {:else if $users.isSuccess}
      <Table>
        <thead>
          <tr>
            <TableHeader>
              <input
                type="checkbox"
                checked={selectedUsers.length > 0 &&
                  selectedUsers.length === $users.data.users.length}
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
          {#each $users.data.users as user}
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
        <svelte:fragment slot="pagination">
          <Pagination
            currentPage={$users.data.metadata.currentPage}
            lastPage={$users.data.metadata.lastPage}
            on:select={selectPage}
            on:selectSize={selectPageSize}
          />
        </svelte:fragment>
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
