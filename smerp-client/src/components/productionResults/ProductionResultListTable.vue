<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <div class="d-flex justify-content-end mb-3">
        <button class="btn btn-success btn-sm" @click="exportToExcel">엑셀 내보내기</button>
      </div>

      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <table v-else-if="productionResults.length > 0" class="table table-hover">
        <thead class="table-light">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">문서 번호</th>
            <th scope="col">공장명</th>
            <th scope="col">품목명</th>
            <th scope="col">규격</th>
            <th scope="col">수량</th>
            <th scope="col">비고</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="result in productionResults" :key="result.id">
            <td>{{ result.id }}</td>
            <td>{{ result.documentNo }}</td>
            <td>{{ result.factoryName || 'N/A' }}</td>
            <td>{{ result.itemName }}</td>
            <td>{{ result.specification }}</td>
            <td>{{ result.qty }}</td>
            <td>{{ result.remark }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th colspan="6" class="text-end">총 수량:</th>
            <th>{{ totalQty }}</th>
            <th colspan="2"></th>
          </tr>
        </tfoot>
      </table>

      <div v-else class="text-center text-muted">
        표시할 생산 실적이 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineExpose } from "vue";
import { fetchProductionResults } from "@/api/productionResult";

const productionResults = ref([]);
const totalQty = ref(0);
const loading = ref(true);
const error = ref(null);

function escapeCsvField(field) {
  if (field === null || field === undefined) {
    return '';
  }
  let stringField = String(field);
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return stringField;
}

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetchProductionResults(); // No pagination
    productionResults.value = res.data.productionResultResponses;
    totalQty.value = res.data.totalQty;
  } catch (e) {
    console.error(e);
    error.value = "생산 실적 정보를 불러오는 데 실패했습니다.";
  } finally {
    loading.value = false;
  }
}

function exportToExcel() {
  if (productionResults.value.length === 0) {
    alert("내보낼 데이터가 없습니다.");
    return;
  }

  const headers = ["ID", "문서 번호", "공장명", "품목명", "규격", "수량", "비고"];
  const rows = productionResults.value.map(result => [
    escapeCsvField(result.id),
    escapeCsvField(result.documentNo),
    escapeCsvField(result.factoryName || 'N/A'),
    escapeCsvField(result.itemName),
    escapeCsvField(result.specification),
    escapeCsvField(result.qty),
    escapeCsvField(result.remark),
  ]);

  let csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(",") + "\n";
  rows.forEach(row => {
    csvContent += row.join(",") + "\n";
  });

  // Add total quantity to the CSV
  csvContent += [
    escapeCsvField(""),
    escapeCsvField(""),
    escapeCsvField(""),
    escapeCsvField(""),
    escapeCsvField(""),
    escapeCsvField("총 수량:"),
    escapeCsvField(totalQty.value),
    escapeCsvField(""),
    escapeCsvField(""),
  ].join(",") + "\n";

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "생산실적현황.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

onMounted(() => load());

defineExpose({ load }); // Expose load method for parent component to refresh
</script>

<style scoped>
.card {
  border: 0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.card-body {
  padding: 20px;
}
.table {
  margin: 0;
  border-collapse: separate;
  border-spacing: 0;
}
.table thead th {
  font-size: 12px;
  letter-spacing: .02em;
  font-weight: 600;
  color: #6b7280;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef !important;
  padding: 14px 16px;
  vertical-align: middle;
}

.table thead th:first-child {
  border-top-left-radius: 8px;
}
.table thead th:last-child {
  border-top-right-radius: 8px;
}
.table tbody td {
  border-top: 1px solid #eef1f6 !important;
  padding: 14px 16px;
  vertical-align: middle;
  color: #334155;
  font-size: 0.9rem;
}
.table-hover tbody tr:hover {
  background: #e9ecef;
}
.table tbody tr {
  height: 56px;
}
.spinner-border {
  width: 2rem;
  height: 2rem;
}
.alert {
  border: none;
  border-radius: 12px;
}
</style>
