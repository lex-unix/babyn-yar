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
  import { admin } from '$lib/stores'
  import { formatDate } from '$lib/format-date'
  import { addToast } from '$components/Toaster.svelte'
  import { deleteErrorMsg, deleteSuccessMsg } from '$lib/toast-messages'
  import { createUsersDeleteMutation, createUsersQuery } from '$query/users'
  import { derived } from 'svelte/store'
  import { page } from '$app/stores'
  import { updateFilter, updateFilters } from '$lib/url-params'

  let selectedUsers: number[] = []
  let alertDialog: DeleteAlertDialog

  let filters = derived(page, $page => ({
    page: $page.url.searchParams.has('page')
      ? parseInt($page.url.searchParams.get('page') as string)
      : 1,
    pageSize: $page.url.searchParams.has('pageSize')
      ? parseInt($page.url.searchParams.get('pageSize') as string)
      : 10
  }))

  const query = createUsersQuery(filters)
  const deleteMutation = createUsersDeleteMutation()

  function toggleSelect(id: number) {
    if (selectedUsers.includes(id)) {
      selectedUsers = selectedUsers.filter(e => e !== id)
    } else {
      selectedUsers = [...selectedUsers, id]
    }
  }

  function toggleSelectAll() {
    if ($query.isSuccess) {
      if (selectedUsers.length === $query.data.users.length) {
        selectedUsers = []
      } else {
        selectedUsers = $query.data.users.map(e => e.id)
      }
    }
  }

  async function deleteSelected() {
    $deleteMutation.mutate(selectedUsers, {
      onSuccess: () => addToast(deleteSuccessMsg),
      onError: () => addToast(deleteErrorMsg)
    })
    selectedUsers = []
    alertDialog.dismiss()
  }

  function selectPage(e: CustomEvent<{ page: number }>) {
    updateFilter('page', e.detail.page)
  }

  function selectPageSize(e: CustomEvent<{ size: number }>) {
    updateFilters({ page: 1, pageSize: e.detail.size })
  }
</script>

{#if $admin}
  <PageHeader>
    <svelte:fragment slot="heading">Користувачі</svelte:fragment>
    <RegisterUserDialog slot="right-items" />
  </PageHeader>

  <Container title="Управління користувачами">
    <RecordActionBar
      bind:selected={selectedUsers}
      on:delete={() => alertDialog.show()}
    />

    {#if $query.isLoading}
      <TableSkeleton />
    {:else if $query.isSuccess}
      <Table>
        <thead>
          <tr>
            <TableHeader>
              <input
                type="checkbox"
                checked={selectedUsers.length > 0 &&
                  selectedUsers.length === $query.data.users.length}
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
          {#each $query.data.users as user}
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
            currentPage={$query.data.metadata.currentPage}
            lastPage={$query.data.metadata.lastPage}
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
