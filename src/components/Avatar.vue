<script lang="ts" setup>
import { type PropType } from 'vue';

// Define the prop and its type
const props = defineProps({
    username: {
        type: String as PropType<string>, // Type-safe prop
        required: true
    },
    size: {
        type: Number as PropType<number>, // Type-safe prop
        required: true
    }
});
</script>

<template>
    <img class="rounded-circle" :src="`https://steemitimages.com/u/${username}/avatar`" alt="img"
        :width="size" :height="size">
</template>