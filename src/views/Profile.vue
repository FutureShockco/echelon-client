<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAuthStore } from '@/stores/auth';
import { useRouter } from "vue-router";
import AccountService from '@/services/account';

import type { ExtendedAccount } from "dsteem";
import type { AccountMetadata, RewardData } from '@/interfaces';

const router = useRouter();
const state = ref();

const account = ref<ExtendedAccount | undefined>(undefined);
const metadata = ref<AccountMetadata | undefined>(undefined);
const rewards = ref<RewardData[] | undefined>(undefined);

onMounted(async () => {
    const username = router.currentRoute.value.params.username as string || "future.witness"

    try {
        rewards.value = await AccountService.getRewards(username)
    } catch (error) {

    }
    try {
        const userAccount = await AccountService.find(username)
        account.value = userAccount;
        metadata.value = (userAccount.json_metadata as AccountMetadata) || {};
    } catch (error) {
        state.value = error;
    }
});
</script>

<template>
    <div class="page-content header-clear-medium">
        <div class="card card-style overflow-visible" v-if="account">
            <div class="content row">
                <div class="col-6">
                    <Avatar :username="account.name" size="120" />
                    <h5 class="color-highlight font-11 mb-0">Account Info</h5>
                </div>
                <div class="col-6">
                    <div>Current Voting Power:</div>
                    <div>Vote Amount:</div>
                    <div>Untill full:</div>
                    <div>RC Status:</div>
                    <div>Reputation: {{ $formatReputation(account.reputation) }}</div>

                </div>
                <h1 class="font-700 font-24 pb-2">@{{ account.name }}</h1>
                <p v-if="metadata?.profile?.about" class="mb-3">
                    {{ metadata?.profile?.about }}
                </p>
                <a href="#" class="default-link btn btn-s gradient-highlight shadow-bg shadow-bg-xs">Send
                    message</a>
            </div>
        </div>
        <div v-if="rewards && rewards[0] && rewards[1] && rewards[2]" class="card card-style overflow-visible mt-4">
            <div class="content">
                <h5 class="color-highlight font-11 mb-n1">Account</h5>
                <h1 class="font-700 pb-2">Rewards</h1>
                <div class="border border-highlight rounded-s overflow-hidden">
                    <table class="table color-theme border-highlight mb-0">
                        <thead class="rounded-s bg-highlight border-l">
                            <tr class="color-white">
                                <th scope="col">
                                    <h6 class="color-white font-10 mb-0">Rewards</h6>
                                </th>
                                <th scope="col">
                                    <h6 class="color-white font-10 mb-0">Curator SP</h6>
                                </th>
                                <th scope="col">
                                    <h6 class="color-white font-10 mb-0">Author SP</h6>
                                </th>
                                <th scope="col">
                                    <h6 class="color-white font-10 mb-0">STEEM</h6>
                                </th>
                                <th scope="col">
                                    <h6 class="color-white font-10 mb-0">SBD</h6>
                                </th>
                                <th scope="col">
                                    <h6 class="color-white font-10 mb-0">Prod SP</h6>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="font-12">
                            <tr>
                                <td><strong>All</strong></td>
                                <td>{{ $amount($vestToSteem(rewards[0].curation_reward.vests)) }}</td>
                                <td>{{ $amount($vestToSteem(rewards[0].author_reward.vests)) }}</td>
                                <td>{{ $amount(rewards[0].author_reward.steem) }}</td>
                                <td>{{ $amount(rewards[0].author_reward.sbd) }}</td>
                                <td>{{ $amount($vestToSteem(rewards[0].producer_reward.vests)) }}</td>
                            </tr>
                            <tr>
                                <td><strong>Month</strong></td>
                                <td>{{ $amount($vestToSteem(rewards[1].curation_reward.vests)) }}</td>
                                <td>{{ $amount($vestToSteem(rewards[1].author_reward.vests)) }}</td>
                                <td>{{ $amount(rewards[1].author_reward.steem) }}</td>
                                <td>{{ $amount(rewards[1].author_reward.sbd) }}</td>
                                <td>{{ $amount($vestToSteem(rewards[1].producer_reward.vests)) }}</td>
                            </tr>
                            <tr>
                                <td><strong>Week</strong></td>
                                <td>{{ $amount($vestToSteem(rewards[2].curation_reward.vests)) }}</td>
                                <td>{{ $amount($vestToSteem(rewards[2].author_reward.vests)) }}</td>
                                <td>{{ $amount(rewards[2].author_reward.steem) }}</td>
                                <td>{{ $amount(rewards[2].author_reward.sbd) }}</td>
                                <td>{{ $amount($vestToSteem(rewards[2].producer_reward.vests)) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="card card-style mb-5">
            <div class="content">
                <h5 class="color-highlight font-11 mb-n1">Account</h5>
                <h1 class="font-700 pb-2">Delegations</h1>
                <div class="tabs tabs-box" id="tab-group-1">
                    <div class="tab-controls rounded-s border-highlight">
                        <a class="font-13 color-highlight" data-bs-toggle="collapse" href="#tab-1"
                            aria-expanded="true">Incoming</a>
                        <a class="font-13 color-highlight collapsed" data-bs-toggle="collapse" href="#tab-2"
                            aria-expanded="false">Outgoing</a>
                        <a class="font-13 color-highlight collapsed" data-bs-toggle="collapse" href="#tab-3"
                            aria-expanded="false">Expiring</a>
                    </div>
                    <div class="mt-3"></div>
                    <div class="collapse show" id="tab-1" data-bs-parent="#tab-group-1" style="">
                        <p>List incoming.</p>
                    </div>
                    <div class="collapse" id="tab-2" data-bs-parent="#tab-group-1" style="">
                        <p>List outgoing.</p>
                    </div>
                    <div class="collapse" id="tab-3" data-bs-parent="#tab-group-1">
                        <p>List expiring.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>