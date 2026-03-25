<script lang="ts">
  import {
    Button,
    Input,
    Label,
    Modal,
    Select,
    Spinner,
  } from "flowbite-svelte";
  import type { Department, Pricing } from "../types";

  import { createEventDispatcher, onMount } from "svelte";
  import { getPricing } from "../services/pricing.service";
  import {
    createDepartment,
    updateDepartment,
  } from "../services/department.service";

  const dispatch = createEventDispatcher();
  export let open = false;
  export let formMode: "create" | "update" = "create";
  export let data: Department = {
    name: "",
    code: "",
    pricingId: 0,
  };
  let pricingList: Array<Pricing> | undefined = [];
  let isLoading = false;

  $: title = formMode === "create"
    ? "Crear Departamento"
    : "Actualizar Departamento";

  onMount(() => {
    getPricing().then((res) => {
      pricingList = res ?? [];
    });
  });
  function close() {
    dispatch("close");
    open = false;
    isLoading = false;
  }
  function handleSubmit() {
    isLoading = true;
    if (formMode === "create") {
      createDepartment({
        name: data.name,
        code: data.code,
        pricingId: data.pricingId,
      }).then((res) => {
        close();
      });
      // create
    } else {
      // update
      updateDepartment(data.id as number, {
        name: data.name,
        code: data.code,
        pricingId: data.pricingId,
      }).then((res) => {
        if (res) {
          close();
        }
      });
    }
  }
</script>

<Modal {title} bind:open outsideclose shadow rounded class="w-[50%]">
  <form class="items-center object-center">
    <Label>Nombre</Label>
    <Input bind:value={data.name} placeholder="Nombre" />
    <Label>Codigo</Label>
    <Input bind:value={data.code} placeholder="Codigo" />
    <Label>Precio</Label>
    <Select label="Precio" bind:value={data.pricingId}>
      {#if pricingList}
        {#each pricingList as pricing}
          <option value={pricing.id}>{pricing.price}</option>
        {/each}
      {:else}
        <option value={0}>Cargando...</option>
      {/if}
    </Select>
  </form>

  <svelte:fragment slot="footer">
    <Button color="primary" on:click={handleSubmit}>
      {formMode === "create" ? "Crear" : "Actualizar"}
      {#if isLoading}
        <Spinner color="white" size="sm" />
      {/if}
    </Button>
  </svelte:fragment>
</Modal>
