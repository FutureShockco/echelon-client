import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ChainProperties, DynamicGlobalProperties } from 'dsteem';
import client from '@/helpers/client';
export const useAppStore = defineStore('appStore', {
    state: () => ({
        globalsProperties: ref<ChainProperties>(),
        dynamicProperties: ref<DynamicGlobalProperties>(),
    }),
    actions: {
        async loadProperties() {
            this.globalsProperties = await client.database.getChainProperties()
            this.dynamicProperties = await client.database.getDynamicGlobalProperties()
        },
    }
});