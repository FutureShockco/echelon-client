<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import ApiService from '@/services/api';

import type { Community } from '@/interfaces';

const router = useRouter();

const community = ref<Community>();
onMounted(async () => {
    try {
        community.value = await ApiService.getFromBridge('get_community', { name: 'hive-' + router.currentRoute.value.params.id, observer: null })
    } catch (error) {

    }
});
</script>

<template>
    <div class="page-content header-clear-medium">
        <div class="card overflow-visible card-style">
            <div class="content mb-0">
                <h4>{{ community?.title }}</h4>
                <p>
                    Join a community on Steem!.
                </p>
                <div class="table-responsive">
                    {{ community?.description }}
                </div>
            </div>
        </div>
    </div>
</template>