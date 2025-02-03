<script setup lang="ts">
import { useRouter } from 'vue-router';
import ContentService from '@/services/content';
import TransactionService from '@/services/transaction';
import { useAuthStore } from '@/stores/auth';

import { onMounted, ref } from 'vue';
import type { Post } from "@/interfaces";

const authStore = useAuthStore();
const router = useRouter();
let posts = ref<Post[]>()
let result = ref()
const send = async () => {
    const response = await TransactionService.send('comment', {
        author: authStore.username,
        permlink: 'unique-permlink-' + new Date().getTime(),
        parent_author: 'guest123',
        parent_permlink: '20230710t182903218z-post',
        title: '',
        body: 'This is posted using ' + authStore.loginAuth,
        json_metadata: '{}'
    })
    result.value = response
    console.log(response)
}

const sendEscrow = async () => {
    const meta = { payment_item: "Tip for SoodalPay development", product_id: "soodalpay,tip-for-soodalpay-development-faec0f" }
    const response = await TransactionService.send('escrow_transfer', {
        from: authStore.username,
        to: 'soodalpay',
        agent: "etainclub",
        escrow_id: 17283148,
        sbd_amount: "0.000 SBD",
        steem_amount: "1.000 STEEM",
        fee: "0.010 STEEM",
        ratification_deadline: "2024-10-14T15:25:30",
        escrow_expiration: "2024-10-17T15:25:30",
        json_meta: JSON.stringify(meta)
    })
    result.value = response
    console.log(response)
}

onMounted(() => {
    ContentService.getTrending()
        .then((contents) => {
            posts.value = contents
        })
        .catch(e => {
            console.error('Could not fetch profile', e);
        })
})
</script>

<template>
    <div class="page-content header-clear-medium">
        <ModularOperation />

    </div>

</template>