<template>
  <div class="card shadow-sm">
    <div class="card-body">

      <!-- ===== 필터 영역 ===== -->
      <div class="row g-2 mb-3">
        <div class="col-md-2">
          <select v-model="filters.method" class="form-select">
            <option value="">메서드 전체</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        <div class="col-md-2">
          <input v-model="filters.uri" class="form-control" placeholder="URI" />
        </div>

        <div class="col-md-2">
          <input v-model.number="filters.status" class="form-control" placeholder="상태 코드" />
        </div>

        <div class="col-md-2">
          <input v-model="filters.principal" class="form-control" placeholder="사용자" />
        </div>

        <div class="col-md-2 d-grid">
          <button class="btn btn-outline-primary" @click="load">
            조회
          </button>
        </div>
      </div>

      <!-- ===== 로딩 / 에러 ===== -->
      <Loading v-if="loading" />
      <Error v-else-if="error" :message="error" />

      <!-- ===== 테이블 ===== -->
      <div v-else-if="logs.length" class="table-responsive">
        <table class="table table-hover align-middle">
          <thead>
            <tr>
              <th>시간</th>
              <th>메서드</th>
              <th>URI</th>
              <th>상태</th>
              <th>소요(ms)</th>
              <th>사용자</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log.id">
              <td>{{ log.timestamp }}</td>
              <td>
                <span class="badge bg-secondary">{{ log.method }}</span>
              </td>
              <td class="text-mono">{{ log.uri }}</td>
              <td>
                <span :class="statusClass(log.status)">
                  {{ log.status }}
                </span>
              </td>
              <td>{{ log.duration }}</td>
              <td>{{ log.principal }}</td>
              <td>{{ log.clientIp }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Empty v-else />

      <!-- ===== 페이지네이션 ===== -->
      <nav v-if="totalPages > 1" class="mt-3">
        <ul class="pagination justify-content-center mb-0">
          <li class="page-item" :class="{ disabled: page === 0 }">
            <button class="page-link" @click="changePage(page - 1)">
              이전
            </button>
          </li>

          <li
            v-for="p in totalPages"
            :key="p"
            class="page-item"
            :class="{ active: page === p - 1 }"
          >
            <button class="page-link" @click="changePage(p - 1)">
              {{ p }}
            </button>
          </li>

          <li
            class="page-item"
            :class="{ disabled: page === totalPages - 1 }"
          >
            <button class="page-link" @click="changePage(page + 1)">
              다음
            </button>
          </li>
        </ul>
      </nav>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineExpose } from "vue";
import { fetchApiLogs } from "@/api/log";

const logs = ref([]);
const loading = ref(false);
const error = ref(null);

/* ===== 페이지네이션 ===== */
const page = ref(0);
const size = 20;
const totalPages = ref(0);

/* ===== 필터 ===== */
const filters = ref({
  method: "",
  uri: "",
  status: "",
  principal: "",
});

/* ===== 로딩 ===== */
async function load() {
  loading.value = true;
  error.value = null;

  try {
    const params = {
      page: page.value,
      size,
    };

    Object.entries(filters.value).forEach(([key, value]) => {
      if (value !== "" && value !== null) {
        params[key] = value;
      }
    });

    const { data } = await fetchApiLogs(params);
    logs.value = data.content;
    totalPages.value = data.totalPages;

  } catch (e) {
    console.error(e);
    error.value = "API 로그를 불러오지 못했습니다.";
  } finally {
    loading.value = false;
  }
}

/* ===== 페이지 변경 ===== */
function changePage(p) {
  if (p < 0 || p >= totalPages.value) return;
  page.value = p;
  load();
}

/* ===== 상태 뱃지 ===== */
function statusClass(code) {
  if (code >= 500) return "badge bg-danger";
  if (code >= 400) return "badge bg-warning";
  return "badge bg-success";
}

/* ===== 필터 변경 시 페이지 초기화 ===== */
watch(filters, () => {
  page.value = 0;
}, { deep: true });

onMounted(load);
defineExpose({ reload: load });
</script>

<style scoped>
.text-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}
</style>
