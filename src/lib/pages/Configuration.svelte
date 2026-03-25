<script lang="ts">
  import PageContainer from "$lib/components/PageContainer.svelte";
  import General from "./configurations/General.svelte";
  import type { PageConfigType } from "$lib/components/types";
  import Periods from "./configurations/Periods.svelte";
  import Departments from "./configurations/Departments.svelte";
  import Users from "./configurations/Users.svelte";
  import Roles from "./configurations/Roles.svelte";
  import Permissions from "./configurations/Permissions.svelte";
  import Pricing from "./configurations/Pricing.svelte";

  const config: PageConfigType[] = [
    {
      title: "General",
      component: General,
      open: true,
    },
    {
      title: "Departamentos",
      component: Departments,
    },
    {
      title: "Usuarios",
      component: Users,
    },
    {
      title: "Roles",
      component: Roles,
    },
    {
      title: "Permisos",
      component: Permissions,
    },
    {
      title: "Periodos",
      component: Periods,
    },
    {
      title: "Precios",
      component: Pricing,
    },
  ];
</script>

<PageContainer tabs={config}></PageContainer>
