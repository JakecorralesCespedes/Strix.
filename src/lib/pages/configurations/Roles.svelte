<script lang="ts">
	import { Alert, Heading, TableBodyCell, TableBodyRow } from "flowbite-svelte";
	import { onMount } from "svelte";
	import Table from "$lib/components/Table.svelte";
	import { getRoles } from "$lib/services/role.service";
	import type { Role, TableHeader, TablePagination } from "$lib/types";

	let roles: Role[] = [];
	let error: string | null = null;
	let pagination: TablePagination = { page: 1 };

	const headers: TableHeader[] = [
		{ name: "Nombre", field: "name" },
		{ name: "Permisos", field: "allowedPermissions" },
	];

	async function loadRoles() {
		const res = await getRoles({ page: pagination.page });

		if (!res) {
			roles = [];
			error = "No se pudieron cargar roles.";
			return;
		}

		roles = res.data ?? [];
		pagination.page = res.page ?? 1;
		pagination.next_page = res.next_page;
		pagination.prev_page = res.prev_page;
		error = null;
	}

	function nextPage() {
		pagination.page = pagination.next_page ?? pagination.page;
		loadRoles();
	}

	function previousPage() {
		pagination.page = pagination.prev_page ?? pagination.page;
		loadRoles();
	}

	onMount(() => {
		loadRoles();
	});
</script>

<div class="w-full h-full px-4 grid gap-3">
	<Heading tag="h3" class="mb-2">Configuracion de Roles</Heading>

	{#if error}
		<Alert type="error" dismissable>{error}</Alert>
	{/if}

	<Table data={roles} headers={headers} {pagination} on:next={nextPage} on:previous={previousPage}>
		<TableBodyRow slot="row" let:row>
			<TableBodyCell>{row.name}</TableBodyCell>
			<TableBodyCell>{row.allowedPermissions?.length ?? 0} permisos</TableBodyCell>
		</TableBodyRow>
	</Table>
</div>
