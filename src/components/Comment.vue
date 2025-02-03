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

onMounted(async () => {
    if (props.comment && props.comment.replies > 0)
        replies.value = await ContentService.findComments(props.comment.author, props.comment.permlink)
})
</script>

<template>
    <div class="mb-4">
        <div class="d-flex">
            <div>
                <Avatar :username="comment.author" class="rounded-xl" width="32" />
                <i class="bi bi-check-circle-fill position-absolute ms-n3 mt-3 pt-2 color-blue-dark"></i>
            </div>
            <div class="ms-1">
                <h6 class="font-12 mb-n1">@{{ comment.author }}</h6>
                <!-- <i class="bi bi-star-fill color-yellow-dark"></i>
                <i class="bi bi-star-fill color-yellow-dark"></i>
                <i class="bi bi-star-fill color-yellow-dark"></i>
                <i class="bi bi-star-fill color-yellow-dark"></i>
                <i class="bi bi-star-fill color-yellow-dark"></i>
                <strong class="color-theme opacity-30 ps-2">5.0</strong> -->
            </div>
            <div class="ms-auto align-self-end">
                <strong class="color-theme font-10">{{ $timeFromNow(comment.last_update) }}</strong>
            </div>
        </div>
        <p class="post line-height-m pt-2" v-html="comment.body">
        </p>
        <div class="d-flex">
            <div class="me-auto"><a href="#" class="color-theme opacity-50"><i
                        class="bi bi-hand-thumbs-up-fill pe-2 font-11"></i>Upvote</a></div>
            <div class="me-auto"><a href="#" class="color-theme opacity-50"><i
                        class="bi bi-hand-thumbs-up-fill pe-2 font-11"></i>Downvote</a></div>
            <div><a href="#" class="color-theme opacity-50"><i class="bi bi-chat-fill font-11 pe-2"></i>Reply</a>
            </div>
            <div class="ms-auto"><a href="#" class="color-theme opacity-50"><i
                        class="bi bi-share-fill font-10 pe-3"></i>Share</a></div>
            <Payout />
        </div>
        <div class="divider mb-3 mt-3"></div>
    </div>
    <SubComments :comment="reply" v-for="(reply, index) in replies" :key="index" />
</template>

<style lang="scss">
.post img {
    max-width: 100%;
    height: auto;
}
</style>