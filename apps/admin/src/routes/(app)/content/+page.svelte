<script>
  import { Folder, History, User } from 'lucide-svelte'
  import {
    Table,
    TableData,
    TableHeader,
    TableRow,
    PageHeader,
    Container
  } from '$components'
</script>

<PageHeader>
  <svelte:fragment slot="heading">Контент</svelte:fragment>
</PageHeader>

<Container title="Контент">
  <Table>
    <thead>
      <tr>
        <TableHeader>
          <div class="inline-flex items-center gap-2">
            <Folder size={16} />
            <span>Розділ</span>
          </div>
        </TableHeader>
        <TableHeader>
          <div class="flex items-center gap-2">
            <History size={16} />
            <span>Остання зміна</span>
          </div>
        </TableHeader>
        <TableHeader>
          <div class="inline-flex items-center gap-2">
            <User size={16} />
            <span>Автор</span>
          </div>
        </TableHeader>
      </tr>
    </thead>
    <tbody>
      <TableRow>
        <TableData>
          <a href="/content/events">Події</a>
        </TableData>
        <TableData>04/27/2023 7:36 AM</TableData>
        <TableData>Олексій Міїн</TableData>
      </TableRow>
      <TableRow>
        <TableData>
          <a href="/content/library">Бібліотека</a>
        </TableData>
        <TableData>04/27/2023 7:36 AM</TableData>
        <TableData>Олексій Міїн</TableData>
      </TableRow>
      <TableRow>
        <TableData>
          <a href="/content/holocaust-documents">Документи Голокосту</a>
        </TableData>
        <TableData>04/27/2023 7:36 AM</TableData>
        <TableData>Олексій Міїн</TableData>
      </TableRow>
      <TableRow>
        <TableData>
          <a href="/content/victim-testimonies">
            Свідчення очевидців трагедії
          </a>
        </TableData>
        <TableData>04/27/2023 7:36 AM</TableData>
        <TableData>Олексій Міїн</TableData>
      </TableRow>
    </tbody>
  </Table>
</Container>
