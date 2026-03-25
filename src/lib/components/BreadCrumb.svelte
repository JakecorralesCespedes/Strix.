<script lang="ts">
  import { Breadcrumb, BreadcrumbItem } from "flowbite-svelte";
  import type { BreadCrumItemType } from "./types";

  export let items: BreadCrumItemType[] = [];
</script>

<Breadcrumb
  olClass="flex items-center space-x-2 h-4 bg-white "
  solid
  navClass="text-gray-500  border"
>
  {#each items as item}
    <BreadcrumbItem href={item.path} home={item.isHome}>
      {item.title}</BreadcrumbItem
    >
  {/each}
</Breadcrumb>
