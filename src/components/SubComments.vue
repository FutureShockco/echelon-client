<script lang="ts" setup>
import ContentService from '@/services/content';
import { onMounted, ref, type PropType } from 'vue';
import type { Comment } from "dsteem";

const props = defineProps({
    comment: {
        type: Comment as unknown as PropType<any>,
        required: false
    }
});
let replies = ref<Comment[]>([]);

onMounted(() => {
    ContentService.findComments(props.comment.author, props.comment.permlink)
        .then((comments) => {
            replies.value = comments
        })
        .catch(e => {
            console.error('Could not fetch profile', e);
        })
})
</script>

<template>
    <div class="ms-2">
        <Comment :comment="comment"  />
    </div>
</template>