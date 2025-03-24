<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth';
import { computed, ref, watch, type Ref } from 'vue';
import { useUiStore } from '@/stores/ui';

const authStore = useAuthStore();

const uiStore = useUiStore();
</script>

<template>
    <div @click="uiStore.toggleSidebar()">
        <div v-if="authStore.isAuthenticated" class="bg-theme mx-3 rounded-m shadow-m mt-3 mb-3">
            <div class="d-flex px-2 pb-2 pt-2">
                <div>
                    <Avatar class="rounded-s" :username="authStore.account?.name" size="45" />
                </div>
                <div class="ps-2 align-self-center">
                    <h5 class="ps-1 mb-0 line-height-xs pt-1">@{{ authStore.account?.name }}</h5>
                    <h6 class="ps-1 mb-0 font-400 opacity-40">Front End Designer</h6>
                </div>
                <div class="ms-auto">
                    <a href="#" data-bs-toggle="dropdown" class="icon icon-m ps-3"><i
                            class="bi bi-three-dots-vertical font-18 color-theme"></i></a>
                    <div class="dropdown-menu  bg-transparent border-0 mt-n1 ms-3">
                        <div class="card card-style rounded-m shadow-xl mt-1 me-1">
                            <div class="list-group list-custom list-group-s list-group-flush rounded-xs px-3 py-1">
                                <a href="page-profile-admin.html"
                                    class="color-theme opacity-70 list-group-item py-1"><strong
                                        class="font-500 font-12">Your Profile</strong><i
                                        class="bi bi-chevron-right"></i></a>
                                <a href="page-activity.html" class="color-theme opacity-70 list-group-item py-1"><strong
                                        class="font-500 font-12">Notifications</strong><i
                                        class="bi bi-chevron-right"></i></a>
                                <a href="page-login-2.html" class="color-theme opacity-70 list-group-item py-1"><strong
                                        class="font-500 font-12">Log Out</strong><i class="bi bi-chevron-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <span class="menu-divider mt-3">NAVIGATION</span>
        <div class="menu-list">
            <div class="card card-style rounded-m p-3 py-2 mb-0">
                <router-link to="/" id="nav-homes"><i
                        class="gradient-blue shadow-bg shadow-bg-xs bi bi-house-fill"></i><span>Home</span><i
                        class="bi bi-chevron-right"></i></router-link>

                <router-link to="/communities" id="nav-pages"><i
                        class="gradient-green shadow-bg shadow-bg-xs bi bi-people-fill"></i><span>Communities</span><i
                        class="bi bi-chevron-right"></i></router-link>
                <router-link to="/test" id="nav-media"><i
                        class="gradient-yellow shadow-bg shadow-bg-xs bi bi-database-fill"></i><span>Test</span><i
                        class="bi bi-chevron-right"></i></router-link>
                <router-link to="/login" id="nav-mails"><i
                        class="gradient-magenta shadow-bg shadow-bg-xs bi bi-key-fill"></i><span>Login</span><i
                        class="bi bi-chevron-right"></i></router-link>
            </div>
        </div>

        <span class="menu-divider mt-4">SETTINGS</span>
        <div class="menu-list">
            <div class="card card-style rounded-m p-3 py-2 mb-0">
                <a href="#" data-toggle-theme>
                    <i class="gradient-dark shadow-bg shadow-bg-xs bi bi-moon-fill font-13"></i>
                    <span>Dark Mode</span>
                    <div class="form-switch ios-switch switch-green switch-s me-2">
                        <input type="checkbox" data-toggle-theme class="ios-input" id="switch-1">
                        <label class="custom-control-label" for="switch-1"></label>
                    </div>
                </a>
            </div>
        </div>

        <span class="menu-divider mt-4">Latest Updates</span>
        <div class="menu-content px-3">
            <div class="card card-style rounded-m p-2 mx-0 bg-theme">
                <a href="#">
                    <div class="d-flex">
                        <div class="align-self-center">
                            <h5 class="font-14 mb-0 ps-1 pt-1">Steem Boilerplate V0.1</h5>
                            <p class="ps-1 pb-1 mb-0 font-11 line-height-s opacity-70">
                                Bootstrap 5 and Vue3
                            </p>
                        </div>
                    </div>
                </a>
                <div class="mb-2"></div>
            </div>
        </div>
    </div>
</template>