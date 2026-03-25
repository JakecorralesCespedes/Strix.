<script lang="ts">
	import { Alert, Heading, Listgroup, ListgroupItem } from "flowbite-svelte";
	import { onMount } from "svelte";
	import { getPermissions } from "$lib/services/permission.service";

	let permissions: string[] = [];
	let error: string | null = null;

	async function loadPermissions() {
		const res = await getPermissions();
		permissions = res;

		if (permissions.length === 0) {
			error = "No se pudieron cargar permisos o la lista esta vacia.";
			return;
		}

		error = null;
	}

	onMount(() => {
		loadPermissions();
	});
</script>

<div class="w-full h-full px-4 grid gap-3">
	<Heading tag="h3" class="mb-2">Configuracion de Permisos</Heading>

	{#if error}
		<Alert type="warning" dismissable>{error}</Alert>
	{/if}

	<Listgroup>
		{#each permissions as permission}
			<ListgroupItem>{permission}</ListgroupItem>
		{/each}
	</Listgroup>
</div>
