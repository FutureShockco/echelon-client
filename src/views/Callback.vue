<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

onMounted(() => authStore.slogin(router.currentRoute.value.query.access_token as string)
    .then(() => {
        router.push('/');
    })
    .catch(e => {
        console.error('Your access token is not valid', e);
    }))
</script>

<template>
    <div class="page-content header-clear-medium">
        <div class="card card-style">
            <div class="card-body text-center">
                <h5 class="mb-n1 font-12 color-highlight font-700 text-uppercase pt-1">The Future is Now</h5>
            </div>
        </div>
    </div>
</template>