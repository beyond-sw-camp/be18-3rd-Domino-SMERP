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
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title mb-4">BOM 소요량 계산</h5>
            <button ref="openModalButtonRef" class="btn btn-primary mb-3" @click="openItemSearchModal">품목 찾기</button>
            <ItemSearchModal ref="itemSearchModalRef" @select="onItemSelect" @closed="onModalClosed" />
            
            <div v-if="isLoading" class="text-center my-5">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">BOM 데이터를 불러오는 중입니다...</p>
            </div>

            <div v-if="error" class="alert alert-danger mt-4" role="alert">
              {{ error }}
            </div>

            <BomTree v-if="bomData" :bomData="bomData" />
            
            <div v-if="!isLoading && !error && !bomData" class="text-center text-muted mt-4">
              <p>품목을 검색하여 BOM 소요량을 계산하세요.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { logout as apiLogout } from "@/api/auth";
import Header from "@/components/layout/Header.vue";
import Sidebar from "@/components/layout/Sidebar.vue";
import ItemSearchModal from '@/components/items/ItemSearchModal.vue';
import BomTree from '@/components/boms/BomTree.vue';
import { getBomRequirements } from '@/api/bom';

const userStore = useUserStore();
const router = useRouter();

const bomData = ref(null);
const isLoading = ref(false);
const error = ref(null);
const itemSearchModalRef = ref(null);
const openModalButtonRef = ref(null);

const breadcrumbs = ref([
  { label: "HOME", to: "/home" },
  { label: "생산 관리" },
  { label: "소요량계산" },
]);

const openItemSearchModal = () => {
    itemSearchModalRef.value?.showModal();
};

const onItemSelect = async (item) => {
    isLoading.value = true;
    bomData.value = null;
    error.value = null; // Clear previous errors
    try {
        const response = await getBomRequirements(item.itemId);
        if (response) { // Changed from response.data to response
            bomData.value = response; // Changed from response.data to response
        } else {
            error.value = 'BOM 데이터를 찾을 수 없습니다.';
        }
    } catch (e) {
        console.error('BOM 데이터 조회 실패:', e);
        error.value = 'BOM 데이터를 불러오는 데 실패했습니다. 서버 응답을 확인하세요.';
    } finally {
        isLoading.value = false;
    }
};

const onModalClosed = () => {
  openModalButtonRef.value?.focus();
};

async function onLogout() {
  try {
    await apiLogout();
    userStore.clear();
    router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
</script>

<style scoped>
.app { min-height: 100vh; background: #f2f4f8; }
.content { background: #f2f4f8; min-width: 768px; }
.card {
  border: 0;
  border-radius: 12px;
}
.card-body {
  padding: 24px;
}
</style>