import { createRouter, createWebHistory } from "vue-router";
export const routes = [
  {
    path: `/`,
    component: () => import("@/layouts/Default.vue"),
    children: [
      { path: "", name: "Home", component: () => import("@/views/Home.vue") }
    ],
  },
  {
    path: `/communities`,
    component: () => import("@/layouts/Default.vue"),
    children: [
      { path: "", name: "Communities", component: () => import("@/views/Communities.vue") }
    ],
  },
  {
    path: `/test`,
    component: () => import("@/layouts/Default.vue"),
    children: [
      { path: "", name: "Test", component: () => import("@/views/Test.vue") }
    ],
  },
  {
    path: `/login`,
    component: () => import("@/layouts/Default.vue"),
    children: [
      { path: "", name: "login", component: () => import("@/views/Login.vue") }
    ],
  },
  {
    path: `/steemlogin`,
    component: () => import("@/layouts/Default.vue"),
    children: [
      { path: "", name: "steemlogin", component: () => import("@/views/Callback.vue") }
    ],
  },
  {
    path: `/hive-:id`,
    component: () => import("@/layouts/Default.vue"),
    children: [
      { path: "", name: "community", component: () => import("@/views/Community.vue") }
    ],
  },
  {
    path: `/@:username`,
    component: () => import("@/layouts/Default.vue"),
    children: [
      { path: "", name: "profile", component: () => import("@/views/Profile.vue") }
    ],
  },
  {
    path: `/@:author/:permlink`,
    component: () => import("@/layouts/Default.vue"),
    children: [
      { path: "", name: "post", component: () => import("@/views/Post.vue") }
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});
