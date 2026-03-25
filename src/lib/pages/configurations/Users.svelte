<script lang="ts">
	import { Alert, Heading, Input, TableBodyCell, TableBodyRow } from "flowbite-svelte";
	import { onMount } from "svelte";
	import Table from "$lib/components/Table.svelte";
	import { getUsers } from "$lib/services/user.service";
	import type { TableHeader, TablePagination, User } from "$lib/types";

	let users: User[] = [];
	let search = "";
	let error: string | null = null;
	let pagination: TablePagination = { page: 1 };

	const headers: TableHeader[] = [
		{ name: "Nombre", field: "name" },
		{ name: "Correo", field: "email" },
		{ name: "Telefono", field: "phone" },
		{ name: "Rol", field: "role" },
		{ name: "Departamento", field: "department" },
	];

	async function loadUsers() {
		const res = await getUsers({
			page: pagination.page,
			search: search.trim() || undefined,
		});

		if (!res) {
			users = [];
			error = "No se pudo cargar usuarios. Revisa sesion o backend.";
			return;
		}

		users = res.data ?? [];
		pagination.page = res.page ?? 1;
		pagination.next_page = res.next_page;
		pagination.prev_page = res.prev_page;
		error = null;
	}

	function handleSearchSubmit() {
		pagination.page = 1;
		loadUsers();
	}

	function nextPage() {
		pagination.page = pagination.next_page ?? pagination.page;
		loadUsers();
	}

	function previousPage() {
		pagination.page = pagination.prev_page ?? pagination.page;
		loadUsers();
	}

	onMount(() => {
		loadUsers();
	});
</script>

<div class="w-full h-full px-4 grid gap-3">
	<Heading tag="h3" class="mb-2">Configuracion de Usuarios</Heading>

	<form on:submit|preventDefault={handleSearchSubmit} class="max-w-sm">
		<Input bind:value={search} placeholder="Buscar por nombre o correo" />
	</form>

	{#if error}
		<Alert type="error" dismissable>{error}</Alert>
	{/if}

	<Table data={users} headers={headers} {pagination} on:next={nextPage} on:previous={previousPage}>
		<TableBodyRow slot="row" let:row>
			<TableBodyCell>{row.name}</TableBodyCell>
			<TableBodyCell>{row.email}</TableBodyCell>
			<TableBodyCell>{row.phone}</TableBodyCell>
			<TableBodyCell>{row.role?.name ?? "-"}</TableBodyCell>
			<TableBodyCell>{row.department?.name ?? "-"}</TableBodyCell>
		</TableBodyRow>
	</Table>
</div>
