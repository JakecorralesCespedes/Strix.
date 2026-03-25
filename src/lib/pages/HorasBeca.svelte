<script lang="ts">
  import { Alert, Badge, Heading } from "flowbite-svelte";
  import { onMount } from "svelte";
  import Table from "$lib/components/Table.svelte";
  import { getWorkHours } from "$lib/services/work-hours.service";
  import type { TableHeader, TablePagination, WorkHours } from "$lib/types";

  let workHours: WorkHours[] = [];
  let error: string | null = null;
  let pagination: TablePagination = { page: 1 };

  const headers: TableHeader[] = [
    { name: "Estudiante", field: "studentName" },
    { name: "Departamento", field: "departmentName" },
    { name: "Horas registradas", field: "amount" },
    { name: "Precio unitario", field: "price" },
    { name: "Total", field: "total" },
    { name: "Estado", field: "status" },
  ];

  function mapHoursForDisplay(hours: WorkHours) {
    return {
      ...hours,
      studentName: hours.student?.name ?? "Unknown",
      departmentName: hours.department?.name ?? "Unknown",
    };
  }

  function getBadgeColor(status: string) {
    if (status === "APPROVED") {
      return "green";
    }
    if (status === "REJECTED") {
      return "red";
    }
    return "yellow";
  }

  async function loadWorkHours() {
    const res = await getWorkHours({ page: pagination.page });

    if (!res) {
      workHours = [];
      error = "No se pudieron cargar las horas registradas.";
      return;
    }

    workHours = res.data ?? [];
    pagination.page = res.page ?? 1;
    pagination.next_page = res.next_page;
    pagination.prev_page = res.prev_page;
    error = null;
  }

  function nextPage() {
    pagination.page = pagination.next_page ?? pagination.page;
    loadWorkHours();
  }

  function previousPage() {
    pagination.page = pagination.prev_page ?? pagination.page;
    loadWorkHours();
  }

  onMount(() => {
    loadWorkHours();
  });
</script>

<div class="w-full h-full px-4 grid gap-3">
  <Heading tag="h3" class="mb-2">Horas de Beca Registradas</Heading>

  {#if error}
    <Alert type="error" dismissable>{error}</Alert>
  {/if}

  <Table
    data={workHours.map(mapHoursForDisplay)}
    {headers}
    {pagination}
    on:next={nextPage}
    on:previous={previousPage}
  >
    <svelte:fragment slot="row" let:row>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {row.studentName}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {row.departmentName}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {row.amount}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        RD$ {row.price?.toLocaleString?.("es-DO") ?? row.price}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        RD$ {row.total?.toLocaleString?.("es-DO") ?? row.total}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm">
        <Badge color={getBadgeColor(row.status)}>
          {row.status}
        </Badge>
      </td>
    </svelte:fragment>
  </Table>
</div>
