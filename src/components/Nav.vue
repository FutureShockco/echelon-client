<script lang="ts" setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useUiStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';

const uiStore = useUiStore();
const authStore = useAuthStore();
const router = useRouter()
</script>

<template>
  <div class="header-bar header-fixed header-app">
    <a @click="uiStore.toggleSidebar()" data-bs-target="#menu-main" href="#"><i class="fad fa-list color-theme"></i></a>
    <router-link to="/" class="header-title color-theme">Steem Boilerplate</router-link>
    <a @click="uiStore.toggleColorMenu()" data-bs-target="#menu-color"><i
        class="bi bi-palette-fill font-13 color-highlight"></i></a>
    <a href="#" class="show-on-theme-light" data-toggle-theme><i class="bi bi-moon-fill font-13"></i></a>
    <a href="#" class="show-on-theme-dark" data-toggle-theme><i
        class="bi bi-lightbulb-fill color-yellow-dark font-13"></i></a>
    <div v-if="authStore.isAuthenticated">
      <a href="#" data-bs-toggle="dropdown" class="mx-auto pe-3">
        <Avatar :username="authStore.account?.name" size="24" />
      </a>
      <div class="dropdown-menu  bg-transparent border-0 mt-n1 ms-3">
        <div class="card card-style rounded-m shadow-xl mt-1 me-1">
          <div class="list-group list-custom list-group-s list-group-flush rounded-xs px-3 py-1">
            <router-link :to="`/@${authStore.username}`" class="color-theme opacity-70 list-group-item py-1"><strong
                class="font-500 font-12">Your Profile</strong><i class="bi bi-chevron-right"></i></router-link>
            <a href="#" class="color-theme opacity-70 list-group-item py-1"><strong
                class="font-500 font-12">Notifications</strong><i class="bi bi-chevron-right"></i></a>
            <div @click="authStore.logout(), router.push('/')" class="color-theme opacity-70 list-group-item py-1">
              <strong class="font-500 font-12">Log Out</strong><i class="bi bi-chevron-right"></i></div>
          </div>
        </div>
      </div>
    </div>
    <router-link v-else to="/login"><i class="bi bi-key font-13"></i></router-link>

  </div>
</template>


<style lang="scss" scoped>
ul {
  list-style: none;
}
</style>
