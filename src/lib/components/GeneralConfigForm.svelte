<script lang="ts">
  import { Input, Button, Label, Spinner } from "flowbite-svelte";
  import { createEventDispatcher, onMount } from "svelte";
  import type { GlobalSetting } from "../types";
  import { PenOutline } from "flowbite-svelte-icons";

  const dispatch = createEventDispatcher();

  export let disabled = true;
  export let isLoading = false;
  export let currentState: GlobalSetting | null = null;

  $: buttonText = disabled ? "Editar" : "Guardar";

  function handleSumbit() {
    if (disabled) {
      disabled = false;
    } else {
      disabled = true;
      dispatch("update", currentState);
    }
  }
</script>

<form
  on:submit|preventDefault={handleSumbit}
  class="flex g-3 space-x-4 items-end"
>
  {#if !currentState || isLoading}
    <div class="text-center">
      <Spinner />
    </div>
  {:else}
    <Label>
      <span>Precio</span>
      <Input
        type="text"
        bind:value={currentState.defaultPrice}
        placeholder="Precio"
        {disabled}
      ></Input>
    </Label>
    <Label>
      <span>Codigo de Estudiante</span>
      <Input
        type="text"
        bind:value={currentState.studentsCode}
        placeholder="Codigo de Estudiante"
        {disabled}
      ></Input>
    </Label>
    <Label>
      <span>Codigo de Beca</span>
      <Input
        type="text"
        bind:value={currentState.scolarshipCode}
        placeholder="Codigo de Beca"
        {disabled}
      ></Input>
    </Label>
    <Label>
      <span>Codigo de Diezmo</span>
      <Input
        type="text"
        bind:value={currentState.tithCode}
        placeholder="Codigo de Diezmo"
        {disabled}
      ></Input>
    </Label>
    <div class="flex align-bottom">
      <Button type="submit" size="sm" color="blue"
        ><PenOutline /> {buttonText}</Button
      >
    </div>
  {/if}
</form>
