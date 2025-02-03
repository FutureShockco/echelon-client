<script lang="ts" setup>

import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore();

</script>
<template>
  <Nav />

  <ColorsMenu v-if="uiStore.colorMenuOpen" id="menu-color" :class="{ show: uiStore.colorMenuOpen }"
    class="offcanvas offcanvas-bottom offcanvas-detached rounded-m" />
  <main class="container d-flex px-0">
    <Sidebar class="show rounded-m mt-5 sticky-top" id="menu-main" data-menu-active="nav-comps" style="width: 300px;" />
    <router-view />
  </main>
  <div v-if="uiStore.sidebarOpen" @click="uiStore.toggleSidebar()" class="offcanvas-backdrop fade show"></div>
  <div v-if="uiStore.colorMenuOpen" @click="uiStore.toggleColorMenu()" class="offcanvas-backdrop fade show"></div>
  <Footer />
</template>