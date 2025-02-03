
import { ComponentCustomProperties } from 'vue';
import type { Character } from './models/character';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $markdown: (value: string) => any;
        $amount: (value: number | undefined) => any;
        $formatReputation: (reputation: string | number) => any;
        $vestToSteem: (vestingShares: number | undefined) => any;
        $timeFromNow: (date: string) => any;

    }
}