<script lang="ts" setup>
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore();
const colors = ['red', 'green', 'blue', 'mint', 'orange', 'yellow', 'magenta', 'brown']

</script>
<template>
    <div>
        <div class="content">
            <div class="d-flex">
                <div>
                    <h1 class="mb-0 font-700 font-20">Color Highlights</h1>
                </div>
                <div class="ms-auto me-n2">
                    <a @click="uiStore.toggleColorMenu()" data-bs-dismiss="offcanvas" class="icon icon-xs mt-n1"><i
                            class="bi bi-x-circle-fill color-red-dark font-18"></i></a>
                </div>
            </div>
            <div class="divider mb-4 mt-2"></div>
            <div class="d-flex text-center px-1 row">
                <div class="col-3" v-for="color in colors" :key="color">
                    <a href="#" @click="uiStore.changeColor(color)"
                        :class="`icon icon-m gradient-${color} shadow-bg shadow-bg-xs rounded-s`">
                        <i v-if="uiStore.themeColor === color" class="bi bi-check-circle-fill color-white font-16"></i>
                        <i v-else class="bi bi-circle color-white font-16"></i></a>
                    <h5 class="font-14 pt-1 text-capitalize">{{ color }}</h5>
                </div>
            </div>
        </div>
    </div>
</template>