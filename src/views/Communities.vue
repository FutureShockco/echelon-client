<script setup lang="ts">
import { onMounted, ref } from "vue";
import ApiService from '@/services/api';

import type { Community } from '@/interfaces';

const communities = ref<Community[]>([]);
const sortBy = ref('rank');

onMounted(async () => {
    try {
        communities.value = await ApiService.getFromBridge('list_communities', { sort: sortBy.value })
    } catch (error) {
        console.log(error)
    }
});
</script>

<template>
    <div class="page-content header-clear-medium">
        <div class="card overflow-visible card-style">
            <div class="content mb-0">
                <h4>Communities</h4>
                <p>
                    Join a community on Steem!.
                </p>
                <form class="row m-0 p-0" novalidate>
                    <div class="form-custom form-label form-icon mb-3 col-8 ps-1">
                        <i class="bi bi-people font-14"></i>
                        <input type="text" class="form-control rounded-xs" id="c1" placeholder="SteemHolders"
                            pattern="[A-Za-z ]{1,32}" required>
                        <label for="c1" class="color-theme">Search</label>
                    </div>
                    <div class="form-custom form-label form-icon mb-3 col-4 pe-1">
                        <i class="bi bi-filter font-13"></i>
                        <select class="form-select rounded-xs" id="c6" aria-label="Floating label select example">
                            <option selected>Rank</option>
                            <option value="1">Subscribers</option>
                            <option value="2">New</option>
                        </select>
                        <label for="c1" class="color-theme">Select an Option</label>
                        <div class="valid-feedback">HTML5 does not offer Dates Field
                            Validation!<!-- text for field valid--></div>
                    </div>
                    <button class="btn btn-full bg-blue-dark rounded-xs text-uppercase font-700 w-100 btn-xxs"
                        type="submit">Search</button>
                </form>
                <div class="table-responsive">
                    <table class="table color-theme mb-2">
                        <thead>
                            <tr>
                                <th class="border-fade-blue" scope="col">Name</th>
                                <th class="border-fade-blue" scope="col">Subs</th>
                                <th class="border-fade-blue text-center" scope="col">Rewards</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="community in communities" class="border-fade-blue">
                                <td><router-link :to="'/' + community.name">{{ community.title }}</router-link></td>
                                <td>{{ community.subscribers }}</td>
                                <td class="text-center">{{ $amount(community.sum_pending) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>