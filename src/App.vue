<script setup lang="ts">
import { getCurrentInstance, onMounted, ref } from 'vue';
import { useUiStore } from '@/stores/ui';
import { useAppStore } from '@/stores/app';
import { useAuthStore } from '@/stores/auth';

const uiStore = useUiStore();
const appStore = useAppStore();
const authStore = useAuthStore()
onMounted(() => {
  appStore.loadProperties()
  authStore.checkUser()
  uiStore.loadTheme()
});
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
.box {
  background-color: var(--bs-tertiary-bg);
}
</style>