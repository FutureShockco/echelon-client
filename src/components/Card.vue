<script lang="ts" setup>
import { computed, ref, type PropType } from 'vue';

const props = defineProps({
    post: {
        type: Comment as unknown as PropType<any>,
        required: false
    }
});

const limitedTags = computed(() => props.post.tags.slice(0, 5));

</script>

<template>
    <router-link :to="`/@${post.author}/${post.permlink}`" class="card card-style">
        <div :style="post.images ? `background-image:url(${post.images[0]})` : ''"
            class="card card-style m-0 bg-11 rounded-0" style="height:230px">
            <div class="card-bottom p-2 mx-2">
                <div class="d-flex">
                    <div>
                        <div class="font-700 mb-n1 opacity-50 color-white" v-if="post.tags">
                            <div class="btn btn-xxs rounded-s font-500 bg-black p-1" v-for="(tag, index) in limitedTags">{{
                                tag }}</div>
                        </div>
                        <h2 class="color-white mt-2">{{ post.title }}</h2>
                    </div>
                    <div class="ms-auto align-self-center">
                        <span class="btn btn-xxs rounded-s font-700 text-uppercase color-black bg-white float-end">Read
                            More</span>
                    </div>
                </div>
                <p class="mb-2 mt-2 font-13 opacity-70 color-white">
                    {{ post.title }}
                </p>
            </div>
            <div class="card-overlay bg-gradient-fade rounded-0"></div>
            <div class="card-overlay bg-black opacity-30 rounded-0"></div>
        </div>
    </router-link>
</template>