import 'regenerator-runtime/runtime';
import { createApp } from "vue";
import { createPinia } from 'pinia'

import App from "@/App.vue";
import { router } from "@/router";
import "bootstrap/scss/bootstrap.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@/scss/bootstrap.scss";
import "@/scss/style.scss";
import "@/styles/font-awesome.css";
import { setupGlobalMethods } from './globalplugin'; // Adjust path as needed

const app = createApp(App).use(createPinia()).use(router);
setupGlobalMethods(app);

router.isReady().then(() => app.mount("#page"));
