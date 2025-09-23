<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h5 class="card-title mb-4">상세 정보</h5>

      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-else-if="sale">
        <!-- Sale Header Details -->
        <div class="row mb-3">
          <div class="col-md-4">
            <label class="form-label fw-bold">판매 전표번호</label>
            <p class="form-control-static">{{ sale.documentNo }}</p>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-bold">회사명</label>
            <p class="form-control-static">{{ sale.companyName }}</p>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-bold">담당자</label>
            <p class="form-control-static">{{ sale.userName }}</p>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-4">
            <label class="form-label fw-bold">창고명</label>
            <p class="form-control-static">{{ sale.warehouseName }}</p>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-bold">총 금액</label>
            <p class="form-control-static">{{ formatCurrency(sale.totalAmount) }}</p>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-bold">비고</label>
            <p class="form-control-static">{{ sale.remark }}</p>
          </div>
        </div>

        <h6 class="fw-bold mb-3">판매 품목</h6>
        <div class="table-responsive mb-4">
          <table class="table table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">품목명</th>
                <th scope="col">규격</th>
                <th scope="col">수량</th>
                <th scope="col">단위</th>
                <th scope="col">단가</th>
                <th scope="col">공급가액</th>
                <th scope="col">세액</th>
                <th scope="col">총액</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="sale.items && sale.items.length === 0">
                <td colspan="8" class="text-center text-muted">판매 품목이 없습니다.</td>
              </tr>
              <tr v-for="item in sale.items" :key="item.itemId">
                <td>{{ item.itemName }}</td>
                <td>{{ item.specification }}</td>
                <td>{{ item.qty }}</td>
                <td>{{ item.unit }}</td>
                <td>{{ formatCurrency(item.specialPrice) }}</td>
                <td>{{ formatCurrency(item.supplyAmount) }}</td>
                <td>{{ formatCurrency(item.tax) }}</td>
                <td>{{ formatCurrency(item.totalAmount) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-4">
          <button type="button" class="btn btn-outline-secondary" @click="goToList">목록으로</button>
          <button v-if="canDelete" type="button" class="btn btn-danger" @click="confirmDelete">삭제</button>
        </div>
      </div>

      <div v-else class="text-center text-muted">
        판매 정보를 찾을 수 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { fetchSaleOrderDetail, deleteSale } from "@/api/sale";
import { useUserStore } from "@/stores/user";

const props = defineProps({
  documentNo: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const userStore = useUserStore();
const sale = ref(null);
const loading = ref(true);
const error = ref(null);

const canDelete = computed(() => userStore.role === '[ROLE_ADMIN]'||'[ROLE_MANAGER]');

async function loadSaleDetail(documentNo) {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetchSaleOrderDetail(documentNo);
    sale.value = response.data;
  } catch (e) {
    console.error('Error fetching sale details:', e);
    error.value = '판매 상세 정보를 불러오는 데 실패했습니다.';
  } finally {
    loading.value = false;
  }
}

async function confirmDelete() {
  if (confirm('정말로 이 판매를 삭제하시겠습니까?')) {
    try {
      await deleteSale(props.documentNo);
      alert('판매가 성공적으로 삭제되었습니다.');
      router.push('/sales');
    } catch (e) {
      console.error('Error deleting sale:', e);
      alert('판매 삭제에 실패했습니다: ' + (e.response?.data?.message || e.message));
    }
  }
}

function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
}

function goToList() {
  router.push('/sales');
}

onMounted(() => {
  if (props.documentNo) {
    loadSaleDetail(props.documentNo);
  }
});

watch(() => props.documentNo, (newDocumentNo) => {
  if (newDocumentNo) {
    loadSaleDetail(newDocumentNo);
  } else {
    sale.value = null;
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
.table-responsive {
  margin-top: 1rem;
}
.table th,
.table td {
  white-space: nowrap;
  text-align: center;
}
.table thead th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #334155;
}
.badge {
  font-size: 0.85em;
  padding: 0.5em 0.75em;
}
</style>