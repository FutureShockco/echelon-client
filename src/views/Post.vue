<script setup lang="ts">
import { computed, onMounted, ref, getCurrentInstance } from "vue";
import { useAuthStore } from '@/stores/auth';
import { useRouter } from "vue-router";
import ContentService from '@/services/content';
import type { Comment, ExtendedAccount } from "dsteem";


const router = useRouter();
let post = ref<Comment>()
let replies = ref<Comment[]>([]);
const htmlContent = ref<string>('');
const instance = getCurrentInstance();

onMounted(async () => {
    const author = router.currentRoute.value.params.author as string
    const permlink = router.currentRoute.value.params.permlink as string
    ContentService.find(author, permlink)
        .then(async (content) => {
            post.value = content
            try {
                if (!instance) {
                    console.error('Current instance is not available');
                    return;
                }
                const { proxy } = instance;
                if (!proxy || typeof proxy.$markdown !== 'function') {
                    console.error('$markdown is not defined on the proxy');
                    return;
                }
                htmlContent.value = await proxy.$markdown(post.value.body);
            } catch (error) {
                console.error('Error setting HTML content:', error);
                htmlContent.value = ''; // Handle errors appropriately
            }
            ContentService.findComments(author, permlink)
                .then((comments) => {
                    replies.value = comments
                })
                .catch(e => {
                    console.error('Could not fetch profile', e);
                })
        })
        .catch(e => {
            console.error('Could not fetch profile', e);
        })

})
</script>

<template>
    <div class="page-content header-clear-medium" v-if="post">
        <div class="card card-style overflow-visible">
            <div class="content">
                <router-link :to="`/@${post.author}`">
                    <Avatar :username="post.author" size="20" />
                    <!-- <img src="images/pictures/7s.jpg" width="120" class="mt-n5 mb-3 rounded-l shadow-l" alt="img"> -->
                    <h2 class="font-700 font-12 pb-2">@{{ post.author }}</h2>
                </router-link>
                <h1>
                    {{ post.title }}
                </h1>
                <div class="post" v-html="htmlContent">
                </div>
            </div>
        </div>


        <Comments :isRoot="true" :author="post.author" :permlink="post.permlink" />

    </div>
</template>

<style lang="scss">
.post img {
    max-width: 100%;
    height: auto;
}

.post iframe {
    max-width: 100%;
    min-height: 240px;
    height: auto;
    margin: 20px 0;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    border: 1px solid #ddd;
    padding: 8px;
}

th {
    background-color: #f2f2f2;
}
</style>