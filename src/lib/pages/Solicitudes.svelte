<script lang="ts">
  import { Alert, Badge, Button, Heading, Modal, TableBodyCell, TableBodyRow, Spinner } from "flowbite-svelte";
  import { onMount } from "svelte";
  import Table from "$lib/components/Table.svelte";
  import { getScholarshipRequests } from "$lib/services/scholarship-request.service";
  import type { StudentOnDepartment, TableHeader, TablePagination } from "$lib/types";

  let requests: StudentOnDepartment[] = [];
  let error: string | null = null;
  let pagination: TablePagination = { page: 1 };
  let selectedRequest: StudentOnDepartment | null = null;
  let detailsOpen = false;

  const headers: TableHeader[] = [
    { name: "ID", field: "id" },
    { name: "Estudiante", field: "student" },
    { name: "Departamento", field: "department" },
    { name: "Estado", field: "status" },
  ];

  function getBadgeColor(status: string) {
    if (status === "APPROVED") {
      return "green";
    }

    if (status === "REJECTED") {
      return "red";
    }

    return "yellow";
  }

  async function loadRequests() {
    const res = await getScholarshipRequests({ page: pagination.page });

    if (!res) {
      requests = [];
      error = "No se pudieron cargar las solicitudes.";
      return;
    }

    requests = res.data ?? [];
    pagination.page = res.page ?? 1;
    pagination.next_page = res.next_page;
    pagination.prev_page = res.prev_page;
    error = null;
  }

  function nextPage() {
    pagination.page = pagination.next_page ?? pagination.page;
    loadRequests();
  }

  function previousPage() {
    pagination.page = pagination.prev_page ?? pagination.page;
    loadRequests();
  }

  function openDetails(request: StudentOnDepartment) {
    selectedRequest = request;
    detailsOpen = true;
  }

  onMount(() => {
    loadRequests();
  });
</script>

<div class="w-full h-full px-4 grid gap-3">
  <Heading tag="h3" class="mb-2">Solicitudes de Beca</Heading>

  {#if error}
    <Alert type="error" dismissable>{error}</Alert>
  {/if}

  <Table
    data={requests}
    headers={headers}
    {pagination}
    on:next={nextPage}
    on:previous={previousPage}
    on:rowClick={(event) => openDetails(event.detail)}
  >
    <TableBodyRow slot="row" let:row>
      <TableBodyCell>{row.id}</TableBodyCell>
      <TableBodyCell>{row.student?.name ?? "-"}</TableBodyCell>
      <TableBodyCell>{row.department?.name ?? "-"}</TableBodyCell>
      <TableBodyCell>
        <Badge color={getBadgeColor(row.status)}>{row.status}</Badge>
      </TableBodyCell>
    </TableBodyRow>
  </Table>
</div>

<Modal title="Detalles de Solicitud" bind:open={detailsOpen} outsideclose>
  {#if selectedRequest}
    <div class="grid gap-3">
      <div>
        <p class="text-sm text-gray-500">Estudiante</p>
        <p class="font-medium">{selectedRequest.student?.name ?? "Unknown"}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">Email</p>
        <p class="font-medium">{selectedRequest.student?.email ?? "-"}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">Código</p>
        <p class="font-medium">{selectedRequest.student?.code ?? "-"}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">Departamento</p>
        <p class="font-medium">{selectedRequest.department?.name ?? "-"}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">Teléfono</p>
        <p class="font-medium">{selectedRequest.student?.phone ?? "-"}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">Estado</p>
        <Badge color={getBadgeColor(selectedRequest.status)}>
          {selectedRequest.status}
        </Badge>
      </div>
    </div>
  {/if}

  <svelte:fragment slot="footer">
    {#if selectedRequest?.status === "PENDING"}
      <Button color="primary" on:click={() => { /* TODO: implement approval */ }}>
        Aprobar Solicitud
      </Button>
    {/if}
    <Button color="alternative" on:click={() => (detailsOpen = false)}>
      Cerrar
    </Button>
  </svelte:fragment>
</Modal>


