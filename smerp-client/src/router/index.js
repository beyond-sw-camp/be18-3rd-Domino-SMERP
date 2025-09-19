import { createRouter, createWebHistory } from "vue-router";
import Login from "@/pages/Login.vue";
import Main from "@/pages/Main.vue";
import Basic from "@/pages/workstation/Basic.vue";
import Etc from "@/pages/workstation/Etc.vue";
import Production from "@/pages/workstation/Production.vue";
import Reports from "@/pages/workstation/Reports.vue";
import Sales from "@/pages/workstation/Sales.vue";
import Purchase from "@/pages/workstation/Purchase.vue";
import User from "@/pages/users/UserPage.vue";
import UserDetailPage from "@/pages/users/UserDetailPage.vue";
import { useUserStore } from "@/stores/user";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login, meta: { public: true } },
    { path: "/home", component: Main, meta: { requiresAuth: true } },
    { path: "/basic", component: Basic },
    { path: "/etc", component: Etc },
    { path: "/production", component: Production },
    { path: "/reports", component: Reports },
    { path: "/purchase", component: Purchase },
    { path: "/sales", component: Sales },
    { path: "/users", component: User },
    { path: "/users/:userId", name: "UserDetail", component: UserDetailPage, props: true },
    { path: "/:pathMatch(.*)*", redirect: "/home" },
  ],
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  if (!to.meta.public && !userStore.loaded) {
    await userStore.loadUser();
  }

  const isAuthed = !!userStore.name;

  if (!isAuthed && !to.meta.public) {
    return next({ path: "/login", query: { redirect: to.fullPath } });
  }

  if (isAuthed && to.path === "/login") {

    return next("/home");
  }

  next();
});

export default router;