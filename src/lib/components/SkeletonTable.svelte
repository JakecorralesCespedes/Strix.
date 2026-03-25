<script lang="ts">
  import { TableBodyCell, TableBodyRow } from "flowbite-svelte";

  export let rows = 5; // Number of rows to show
  export let columns = 3; // Number of columns
</script>

{#each Array(rows) as _, rowIndex}
  <TableBodyRow>
    {#each Array(columns) as _, colIndex}
      <TableBodyCell>
        <div class="animate-pulse">
          <div class="h-[1rem] bg-gray-200 mt-3 rounded"></div>
        </div>
      </TableBodyCell>
    {/each}
  </TableBodyRow>
{/each}
