<script lang="ts" setup>
import ContentService from '@/services/content';
import { onMounted, ref, type PropType } from 'vue';
import type { Comment } from "dsteem";
//@ts-ignore
const props = defineProps({
    comment: {
        type: Object as PropType<Comment>,
        required: true
    }
});


</script>

<template>
    <div class="ms-auto"><a href="#" class="color-theme opacity-50"><i
                class="bi bi-share-fill font-10 pe-3"></i>Share</a></div>
</template>