<script lang="ts" setup>
import ContentService from '@/services/content';
import { onMounted, ref, type PropType } from 'vue';
import type { Comment } from "dsteem";

const props = defineProps({
    isRoot: {
        type: Boolean as PropType<boolean>,
        required: false
    },
    author: {
        type: String as PropType<string>,
        required: true
    },
    permlink: {
        type: String as PropType<string>,
        required: true
    }
});
let replies = ref<Comment[]>([]);

onMounted(() => {
    ContentService.findComments(props.author, props.permlink)
        .then((comments) => {
            replies.value = comments
        })
        .catch(e => {
            console.error('Could not fetch profile', e);
        })
})
</script>

<template>
    <div class="card card-style mb-0" style="border-radius: 30px 30px 0px 0px;">
        <div class="content m-0">
            <div class="d-flex px-3">
                <div>
                    <h5 class="pb-1 pt-3 font-13">Replies</h5>
                </div>
                <div class="ms-auto">
                    <h5 class="ps-3 pb-1 pt-3 font-13 color-highlight">{{ replies.length }}</h5>
                </div>
            </div>
        </div>
    </div>
    <div class="card card-style mt-0 pt-3 border-top" style="border-radius: 0px 0px 30px 30px;">
        <div class="content mt-0">
            <Comment :comment="reply" v-for="(reply, index) in replies" :key="index" />
        </div>
    </div>
</template>