<script setup lang="ts">
import { ref } from "vue";
import sc from '@/helpers/steemlogin';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from "vue-router";
import AccountService  from '@/services/account';
import  EncryptionService from '@/services/encryption';

const router = useRouter();
const authStore = useAuthStore();
let hasKeychain = ref(false)
let useKeychain = ref(false)
let username = ref('')
let privateKey = ref('')
let errorMessage = ref('')
// @ts-ignore
if (window.steem_keychain) {
    hasKeychain.value = true
    useKeychain.value = true
}

const login = () => {
    errorMessage.value = ''
    if (!useKeychain.value)
        AccountService.isPostingKeyValid(username.value, privateKey.value).then(async isValid => {
            if (isValid) {
                await EncryptionService.generateEncryptionKey();
                await EncryptionService.encryptAndStorePrivateKey(privateKey.value);
                console.log('Posting private key is valid');
                authStore.handleLogin(username.value, useKeychain.value, privateKey.value).then(() => {
                    router.push('/');
                })
                    .catch(e => {
                        console.error('Private key wrong?', e);
                    })
            } else {
                errorMessage.value = 'Posting private key is invalid'
                return
            }
        });
    else
        authStore.handleLogin(username.value, useKeychain.value, privateKey.value).then(() => {
            router.push('/');
        })
            .catch(e => {
                console.error('Private key wrong?', e);
            })
}

</script>


<template>
    <div class="page-content header-clear-medium">
        <div class="card card-style">
            <div class="content">
                <h1 class="text-center font-800 font-30 mb-2">Sign In</h1>
                <p class="text-center font-13 mt-n2 mb-3">Choose your option</p>
                <a :href="sc.getLoginURL()"
                    class='btn rounded-sm btn-m gradient-mint text-uppercase font-700 mt-4 mb-4 btn-full shadow-bg shadow-bg-s'>SteemLogin</a>
                <p class="text-center font-13 mt-n2 mb-3">or</p>

                <div class="form-custom form-label form-icon mb-3">
                    <i class="bi bi-person-circle font-14"></i>
                    <input v-model="username" type="text" class="form-control rounded-xs" id="c1"
                        placeholder="@username" />
                    <label for="c1" class="color-theme">Your Name</label>
                    <span>(required)</span>
                </div>
                <div v-if="!useKeychain" class="form-custom form-label form-icon mb-3">
                    <i class="bi bi-asterisk font-12"></i>
                    <input v-model="privateKey" type="password" class="form-control rounded-xs" id="c2"
                        placeholder="Posting Key" />
                    <label for="c2" class="color-theme">Private Posting Key</label>
                    <span>(required)</span>
                </div>
                <div v-if="hasKeychain" class="d-flex mx-1" data-trigger-switch="switch-login">
                    <div class="align-self-center">
                        <h6 class="mb-0 font-12">Use Steem Keychain</h6>
                    </div>
                    <div class="ms-auto align-self-center">
                        <div class="form-switch android-switch switch-blue switch-s">
                            <input type="checkbox" class="android-input" id="switch-login" v-model="useKeychain"
                                :checked="useKeychain">
                            <label class="custom-control-label" for="switch-login"></label>
                        </div>
                    </div>
                </div>

                <div @click="login"
                    class='btn rounded-sm btn-m gradient-green text-uppercase font-700 mt-3 mb-3 btn-full shadow-bg shadow-bg-s'>
                    Sign
                    In</div>
                <div v-if="errorMessage"
                    class="card card-style bg-red-dark show shadow-bg shadow-bg-s fade m-0 p-0 mb-1">
                    <div class="content my-1">
                        <div class="d-flex">
                            <div class="align-self-center">
                                <i class="bi bi-emoji-frown-fill font-18 d-block color-white"></i>
                            </div>
                            <div class="align-self-center">
                                <p class="color-white mb-0 font-500 font-14 ps-3 pe-4 line-height-s">
                                    {{ errorMessage }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex">
                    <div>
                        <a href="page-forgot-1.html" class="color-theme opacity-30 font-12">Recover Account</a>
                    </div>
                    <div class="ms-auto">
                        <a href="page-register-1.html" class="color-theme opacity-30 font-12">Create Account</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="card card-style py-3">
            <div class="content text-center">
                <h5 class="mb-n1 font-12 color-highlight font-700 text-uppercase">Time to move to the future</h5>
                <h2>Vote for @future.witness</h2>
                <p class="mb-3">
                    We are building the future of Steem!
                </p>
                <a href="#"
                    class="btn btn-m btn-full rounded-s gradient-highlight shadow-bg shadow-bg-s px-5 mb-0 mt-2">
                    Vote
                    Now</a>
            </div>
        </div>
    </div>
</template>