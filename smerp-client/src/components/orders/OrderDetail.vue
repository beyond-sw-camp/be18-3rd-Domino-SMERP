<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h5 class="card-title mb-4">주문 상세 정보</h5>

      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-else-if="order">
        <!-- Order Header Details -->
        <div class="row mb-3">
          <div class="col-md-4">
            <label class="form-label fw-bold">문서번호</label>
            <p class="form-control-static">{{ order.documentNo }}</p>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-bold">회사명</label>
            <p class="form-control-static">{{ order.companyName }}</p>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-bold">상태</label>
            <p class="form-control-static">
              <span :class="getOrderStatusClass(order.status)">{{ getOrderStatusDisplayName(order.status) }}</span>
            </p>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-4">
            <label class="form-label fw-bold">납기일</label>
            <p class="form-control-static">{{ order.deliveryDate }}</p>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-bold">담당자</label>
            <p class="form-control-static">{{ order.userName }}</p>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-md-12">
            <label class="form-label fw-bold">비고</label>
            <p class="form-control-static">{{ order.remark }}</p>
          </div>
        </div>

        <h6 class="fw-bold mb-3">주문 품목</h6>
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
                <th scope="col">납기일</th>
                <th scope="col">비고</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="order.items.length === 0">
                <td colspan="10" class="text-center text-muted">주문 품목이 없습니다.</td>
              </tr>
              <tr v-for="item in order.items" :key="item.itemId">
                <td>{{ item.itemName }}</td>
                <td>{{ item.specification }}</td>
                <td>{{ item.qty }}</td>
                <td>{{ item.unit }}</td>
                <td>{{ formatCurrency(item.specialPrice) }}</td>
                <td>{{ formatCurrency(item.supplyAmount) }}</td>
                <td>{{ formatCurrency(item.tax) }}</td>
                <td>{{ formatCurrency(item.totalAmount) }}</td>
                <td>{{ item.deliveryDate }}</td>
                <td>{{ item.remark }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-4">
          <button type="button" class="btn btn-outline-secondary" @click="goToList">목록으로</button>
        </div>
      </div>

      <div v-else class="text-center text-muted">
        주문 정보를 찾을 수 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { fetchOrderDetail } from "@/api/order";

const props = defineProps({
  documentNo: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const order = ref(null);
const loading = ref(true);
const error = ref(null);

async function loadOrderDetail(documentNo) {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetchOrderDetail(documentNo);
    order.value = response.data;
  } catch (e) {
    console.error('Error fetching order details:', e);
    error.value = '주문 상세 정보를 불러오는 데 실패했습니다.';
  } finally {
    loading.value = false;
  }
}

function getOrderStatusDisplayName(status) {
  switch (status) {
    case 'COMPLETED': return '완료';
    case 'PENDING': return '대기중';
    case 'APPROVED': return '승인됨';
    case 'CANCELLED': return '취소됨';
    default: return status;
  }
}

function getOrderStatusClass(status) {
  switch (status) {
    case 'COMPLETED':
      return 'badge bg-success';
    case 'PENDING':
      return 'badge bg-warning';
    case 'APPROVED':
      return 'badge bg-info';
    case 'CANCELLED':
      return 'badge bg-danger';
    default:
      return 'badge bg-secondary';
  }
}

function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
}

function goToList() {
  router.push('/orders');
}

onMounted(() => {
  if (props.documentNo) {
    loadOrderDetail(props.documentNo);
  }
});

watch(() => props.documentNo, (newDocumentNo) => {
  if (newDocumentNo) {
    loadOrderDetail(newDocumentNo);
  } else {
    order.value = null;
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
