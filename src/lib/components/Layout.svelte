<script lang="ts">
  import {
    Button,
    Dropdown,
    DropdownItem,
    Breadcrumb,
    BreadcrumbItem,
  } from "flowbite-svelte";

  import { BarsOutline } from "flowbite-svelte-icons";
  import BreadCrumb from "./BreadCrumb.svelte";
  import { type BreadCrumItemType } from "./types";
  import { navigate, useLocation } from "svelte-routing";
  import { logOut } from "../../stores/user.store";
  import { getCurrentUser } from "$lib/services/user.service";
  import type { User } from "$lib/types";

  let currentUser: User | null = null;
  let currentPath = "/";
  const location = useLocation();

  const routeTitles: Record<string, string> = {
    "/": "Inicio",
    "/configuraciones": "Configuraciones",
    "/solicitudes": "Solicitudes",
    "/horas-beca": "Horas beca",
    "/reportes": "Reportes",
    "/time-tracking": "Registro de Tiempo",
  };

  async function loadCurrentUser() {
    const user = await getCurrentUser();
    currentUser = user ?? null;
  }

  $: breadCrumItems = [
    { title: "Home", path: "/", isHome: true },
    {
      title: routeTitles[currentPath] ?? "Seccion",
      path: currentPath,
    },
  ] as BreadCrumItemType[];

  function handleMenu(path: string) {
    navigate(path);
  }

  async function handleLogout() {
    await logOut();
    navigate("/login");
  }

  $: currentPath = $location.pathname || "/";

  // Menu visibility based on role
  $: isAdmin = currentUser?.role?.name === "Admin";
  $: canViewSholarships = isAdmin;
  $: canViewWorkHours = isAdmin;
  $: canViewReports = isAdmin;
  $: canViewTimeTracking = true;

  loadCurrentUser();
</script>

<div class="h-screen px-8 pt-4">
  <div class="flex justify-between items-center">
    <div>
      <Button color="light" class="h-10">
        <BarsOutline class="w-5 h-5 pt-1" /> Menu
      </Button>

      <Dropdown>
        {#if isAdmin}
          <DropdownItem on:click={() => handleMenu("/configuraciones")}
            >Configuraciones</DropdownItem
          >
        {/if}
        {#if canViewSholarships}
          <DropdownItem on:click={() => handleMenu("/solicitudes")}
            >Solicitudes</DropdownItem
          >
        {/if}
        {#if canViewWorkHours}
          <DropdownItem on:click={() => handleMenu("/horas-beca")}
            >Horas beca</DropdownItem
          >
        {/if}
        {#if canViewTimeTracking}
          <DropdownItem on:click={() => handleMenu("/time-tracking")}
            >Registro de Tiempo</DropdownItem
          >
        {/if}
        {#if canViewReports}
          <DropdownItem on:click={() => handleMenu("/reportes")}
            >Reportes</DropdownItem
          >
        {/if}
      </Dropdown>
    </div>
    <div class="grow mx-2">
      <BreadCrumb items={breadCrumItems}></BreadCrumb>
    </div>
    <Button color="light" class="h-10">
      <BarsOutline class="w-5 h-5 pt-1" /> {currentUser?.name ?? "Usuario"}
    </Button>

    <Dropdown>
      <DropdownItem class="text-red-500" on:click={handleLogout}
        >cerrar sesion</DropdownItem
      >
    </Dropdown>
  </div>
  <slot />
</div>

<style>
  :global(body) {
    background: #eaf1fb;
  }
</style>
