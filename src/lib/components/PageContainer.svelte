<script lang="ts">
  import { Tabs, TabItem } from "flowbite-svelte";
  import type { PageConfigType } from "./types";

  export let tabs: PageConfigType[] = [];
</script>

<Tabs
  tabStyle="underline"
  activeClasses="p-4 text-primary-600 bg-gray-100 rounded-t-lg dark:bg-gray-800 dark:text-primary-500"
  class="mt-4 bg-white rounded-lg"
  contentClass="min-w-full  w-full  container m-0 bg-white p-4 rounded-lg dark:bg-gray-800 mt-4 transition-all duration-300 "
>
  {#each tabs as { title, component, open }}
    <TabItem {open} {title}>
      <svelte:fragment>
        <svelte:component this={component} class="w-full" />
      </svelte:fragment>
    </TabItem>
  {/each}
</Tabs>
