<script lang="ts">
  import {
    Button,
    Checkbox,
    Input,
    Label,
    Modal,
    Spinner,
  } from "flowbite-svelte";
  import type { MailingList } from "../types";
  import {
    createMalingList,
    updateMailingList,
  } from "../services/mailing-list.service";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let open = false;
  export let formMode: "create" | "update" = "create";
  export let data: MailingList = {
    email: "",
    name: "",
    active: true,
  };
  let isLoading = false;

  const title = formMode
    ? "Crear Correo de Notificacion"
    : "Actualizar Correo de Notificacion";
  function close() {
    dispatch("close");
    open = false;
    isLoading = false;
  }
  function handleSubmit() {
    isLoading = true;
    if (formMode === "create") {
      // create
      createMalingList({
        email: data.email,
        name: data.name,
        active: data.active,
      }).then((res) => {
        close();
      });
    } else {
      // update
      updateMailingList(data.id as number, {
        email: data.email,
        name: data.name,
        active: data.active,
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
    <Label class="block mb-2">Nombre</Label>
    <Input bind:value={data.name} type="text" required />
    <Label class="block mb-2">Correo</Label>
    <Input bind:value={data.email} type="email" required />
    {#if formMode === "update"}
      <Label class="block mb-2">Estado</Label>
      <Checkbox bind:checked={data.active}
        >{data.active ? "Activo" : "Inactivo"}
      </Checkbox>
    {/if}
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
