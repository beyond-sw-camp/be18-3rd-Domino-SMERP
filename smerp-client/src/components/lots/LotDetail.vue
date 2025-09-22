<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h5 class="card-title mb-4">로트 상세 정보</h5>

      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-else-if="lot">
        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label fw-bold">로트명</label>
            <p class="form-control-static">{{ lot.lotName }}</p>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold">품목명</label>
            <p class="form-control-static">{{ lot.itemName }}</p>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-4">
            <label class="form-label fw-bold">수량</label>
            <p class="form-control-static">{{ lot.qty }}</p>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-bold">상태</label>
            <p class="form-control-static">
              <span :class="getLotStatusClass(lot.status)">{{ lot.status }}</span>
            </p>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-bold">생성일시</label>
            <p class="form-control-static">{{ new Date(lot.lotInstant).toLocaleString() }}</p>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-4">
          <button type="button" class="btn btn-outline-secondary" @click="goToList">목록으로</button>
        </div>
      </div>

      <div v-else class="text-center text-muted">
        로트 정보를 찾을 수 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { fetchLotDetail } from "@/api/lot";

const props = defineProps({
  lotId: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const lot = ref(null);
const loading = ref(true);
const error = ref(null);

async function loadLotDetail(id) {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetchLotDetail(id);
    lot.value = response.data;
  } catch (e) {
    console.error('Error fetching lot details:', e);
    error.value = '로트 정보를 불러오는 데 실패했습니다.';
  } finally {
    loading.value = false;
  }
}

function getLotStatusClass(status) {
  switch (status) {
    case '사용중':
      return 'badge bg-success';
    case '불량':
      return 'badge bg-danger';
    default:
      return 'badge bg-secondary';
  }
}

function goToList() {
  router.push('/lots');
}

onMounted(() => {
  if (props.lotId) {
    loadLotDetail(props.lotId);
  }
});

watch(() => props.lotId, (newLotId) => {
  if (newLotId) {
    loadLotDetail(newLotId);
  }
});
</script>

<style scoped>
.card {
  border: 0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.card-body {
  padding: 24px;
}
.form-label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #334155;
}
.form-control-static {
  padding: 10px 12px;
  border-radius: 8px;
  background-color: #f8f9fa;
  font-size: 0.95rem;
  color: #495057;
}
.badge {
  font-size: 0.9em;
  padding: 0.5em 0.75em;
}
.btn-outline-secondary {
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
}
</style>