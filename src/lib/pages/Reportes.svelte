<script lang="ts">
  import { Button, Card, Heading, P } from "flowbite-svelte";
  import { navigate } from "svelte-routing";

  const hardcodedReports = [
    {
      title: "Reporte de Periodos",
      description:
        "Genera PDF formal o Excel seleccionando un periodo desde la seccion de Periodos.",
      actionLabel: "Ir a Periodos",
      actionPath: "/configuraciones",
    },
    {
      title: "Reporte de Solicitudes",
      description:
        "Visualiza solicitudes por estudiante y departamento con estado de aprobacion.",
      actionLabel: "Ver Solicitudes",
      actionPath: "/solicitudes",
    },
    {
      title: "Reporte de Horas Beca",
      description:
        "Consulta resumen de horas registradas, aprobadas y monto acumulado.",
      actionLabel: "Ver Horas Beca",
      actionPath: "/horas-beca",
    },
  ];
</script>

<div class="mt-4 grid gap-4">
  <Heading tag="h3">Reportes</Heading>
  <P class="text-gray-600">Panel rapido para abrir los reportes disponibles del sistema.</P>

  <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
    {#each hardcodedReports as report}
      <Card>
        <h5 class="text-lg font-semibold">{report.title}</h5>
        <p class="text-sm text-gray-600 mt-2">{report.description}</p>
        <div class="mt-4">
          <Button size="sm" on:click={() => navigate(report.actionPath)}
            >{report.actionLabel}</Button
          >
        </div>
      </Card>
    {/each}
  </div>
</div>
