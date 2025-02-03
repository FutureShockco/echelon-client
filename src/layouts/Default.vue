<script lang="ts" setup>

import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore();

</script>
<template>
  <Nav />
  <Sidebar :class="{ show: uiStore.sidebarOpen }" class="offcanvas offcanvas-start offcanvas-detached rounded-m"
    id="menu-main" data-menu-active="nav-comps" />
  <ColorsMenu v-if="uiStore.colorMenuOpen" id="menu-color" :class="{ show: uiStore.colorMenuOpen }"
    class="offcanvas offcanvas-bottom offcanvas-detached rounded-m" />
  <main class="container px-0">
    <router-view />
  </main>
  <div v-if="uiStore.sidebarOpen" @click="uiStore.toggleSidebar()" class="offcanvas-backdrop fade show"></div>
  <div v-if="uiStore.colorMenuOpen" @click="uiStore.toggleColorMenu()" class="offcanvas-backdrop fade show"></div>
  <Footer />
</template>