<template>
  <div class="app d-flex">
    <Sidebar />
    <div class="flex-grow-1 d-flex flex-column">
      <Header
        :user-name="userStore.name || 'Guest'"
        :breadcrumbs="breadcrumbs"
        @logout="onLogout"
      />
      <main class="content container-fluid py-3">
        <ActionLogDetail :log-id="logId" />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "@/components/layout/Sidebar.vue";
import Header from "@/components/layout/Header.vue";
import ActionLogDetail from "@/components/logs/ActionLogDetail.vue";
import { useUserStore } from "@/stores/user";
import { useRoute, useRouter } from "vue-router";
import { logout as apiLogout } from "@/api/auth";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const logId = route.params.logId;

const breadcrumbs = [
  { label: "HOME", to: "/home" },
  { label: "통계 및 로그", to: "/logs?view=action" },
  { label: "행위 로그 상세" },
];

async function onLogout() {
  await apiLogout();
  userStore.clear();
  router.push("/login");
}
</script>

<style scoped>
.app { min-height: 100vh; background: #f2f4f8; }
.content { background: #f2f4f8; min-width: 768px; }
</style>
