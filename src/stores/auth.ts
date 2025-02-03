import { defineStore } from 'pinia';
import { ref } from 'vue';
import sc from '@/helpers/steemlogin';
import type { IAccount } from '@/interfaces';
import AccountService from '@/services/account';
const appName = import.meta.env.VITE_APP_NAME
export const useAuthStore = defineStore('authStore', {
    state: () => ({
        isAuthenticated: ref<boolean>(false),
        username: ref<string>(''),
        account: ref<IAccount>(),
        loginAuth: ref<string>('steem')
    }),
    actions: {
        async slogin(access_token: string) {
            new Promise<void>(resolve => {
                if (localStorage.getItem(appName + '-access_token') || access_token) {
                    const token = localStorage.getItem(appName + '-access_token') || access_token;
                    sc.setAccessToken(token);
                    sc.me().then((user: { account: IAccount; name: string; }) => {
                        this.isAuthenticated = true
                        this.loginAuth = 'steemlogin'
                        this.account = user.account
                        this.username = user.name
                        localStorage.setItem(appName + '-access_token', access_token)
                        localStorage.setItem(appName + '-login_auth', 'steemlogin')
                        localStorage.setItem(appName + '-auth_name', this.username)

                        resolve()
                    })
                } else {
                    localStorage.removeItem('access_token');
                    console.log('no access token or expired');
                }
            })
        },
        logout() {
            this.isAuthenticated = false
            localStorage.removeItem(appName + '-login_auth')
            localStorage.removeItem(appName + '-access_token');
            localStorage.removeItem(appName + '-auth_name');
            localStorage.removeItem(appName + '-encryptedpk')

        },
        async handleLogin(username: string, keychainLogin: boolean, posting_key?: string) {
            new Promise<void>(async resolve => {
                const user = await AccountService.find(username) as unknown as IAccount;

                if (keychainLogin) {
                    localStorage.setItem(appName + '-login_auth', 'keychain')
                    try {
                        //@ts-ignore
                        window.steem_keychain.requestSignBuffer(
                            username, // Steem username
                            'hello',  // The message to be signed
                            'Posting', // The key type ('Posting' in this case)
                            (response: { success: any; result: any; message: any; }) => {
                                if (response.success) {
                                    localStorage.setItem(appName + '-login_auth', 'keychain')
                                    localStorage.setItem(appName + '-auth_name', username)
                                    this.isAuthenticated = true
                                    this.loginAuth = 'keychain'
                                    this.account = user
                                    this.username = user.name
                                    resolve()
                                } else {
                                    console.log("Signing failed:", response.message);
                                }
                            }
                        )
                    } catch (e) {
                        console.log(e)
                    }
                }
                else {
                    this.isAuthenticated = true
                    this.account = user
                    this.username = user.name
                    this.loginAuth = 'steem'
                    localStorage.setItem(appName + '-login_auth', 'steem')
                    localStorage.setItem(appName + '-auth_name', username)
                }
            })

        },
        async checkUser() {
            const loginAuth = localStorage.getItem(appName + '-login_auth')
            if (loginAuth) {
                if (loginAuth === 'steemlogin') {
                    const token = localStorage.getItem(appName + '-access_token') || '';
                    this.slogin(token)
                }
                else {
                    const username = localStorage.getItem(appName + '-auth_name') || '';
                    const user = await AccountService.find(username) as unknown as IAccount;
                    this.isAuthenticated = true
                    this.loginAuth = loginAuth
                    this.account = user
                    this.username = username
                }
            }
        }
    }
});