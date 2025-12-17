<template>
  <div class="card shadow-sm">
    <div class="card-body">

      <!-- ===== 필터 영역 ===== -->
      <div class="row g-2 mb-3 align-items-end">
        <div class="col-md-2">
          <label class="form-label small">상태 코드</label>
          <input
            v-model.number="filters.status"
            type="number"
            class="form-control"
            placeholder="예: 500"
          />
        </div>

        <div class="col-md-3">
          <label class="form-label small">URI</label>
          <input
            v-model="filters.uri"
            class="form-control"
            placeholder="/api/..."
          />
        </div>

        <div class="col-md-2">
          <label class="form-label small">사용자</label>
          <input
            v-model="filters.principal"
            class="form-control"
            placeholder="admin"
          />
        </div>

        <div class="col-md-3">
          <label class="form-label small">예외 클래스</label>
          <input
            v-model="filters.exceptionClass"
            class="form-control"
            placeholder="NullPointerException"
          />
        </div>

        <div class="col-md-2 d-grid">
          <button class="btn btn-outline-primary" @click="onSearch">
            조회
          </button>
        </div>
      </div>

      <!-- ===== 로딩 / 에러 ===== -->
      <Loading v-if="loading" />
      <Error v-else-if="error" :message="error" />

      <!-- ===== 테이블 ===== -->
      <div v-else-if="logs.length" class="table-responsive">
        <table class="table table-hover align-middle error-log-table">
          <thead>
            <tr>
              <th class="col-time">시간</th>
              <th class="col-method">메서드</th>
              <th>URI</th>
              <th class="col-status">상태</th>
              <th>예외</th>
              <th>메시지</th>
              <th class="col-user">사용자</th>
              <th class="col-ip">IP</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="log in logs" :key="log.id">
              <td class="col-time">{{ log.timestamp }}</td>

              <td class="col-method">
                <span class="badge bg-secondary">
                  {{ log.method }}
                </span>
              </td>

              <td class="text-mono text-wrap">
                {{ log.uri }}
              </td>

              <td class="col-status">
                <span class="badge" :class="statusClass(log.status)">
                  {{ log.status }}
                </span>
              </td>

              <td class="text-danger fw-semibold text-wrap">
                {{ log.exceptionClass }}
              </td>

              <td class="text-muted small text-wrap">
                {{ log.exceptionMessage }}
              </td>

              <td class="col-user">{{ log.principal }}</td>
              <td class="col-ip">{{ log.clientIp }}</td>
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
import { fetchErrorLogs } from "@/api/log";

const logs = ref([]);
const loading = ref(false);
const error = ref(null);

const page = ref(0);
const size = 20;
const totalPages = ref(0);

const filters = ref({
  status: "",
  uri: "",
  principal: "",
  exceptionClass: "",
});

async function load() {
  loading.value = true;
  error.value = null;

  try {
    const params = { page: page.value, size };

    Object.entries(filters.value).forEach(([k, v]) => {
      if (v !== "" && v !== null) params[k] = v;
    });

    const { data } = await fetchErrorLogs(params);
    logs.value = data.content;
    totalPages.value = data.totalPages;
  } catch (e) {
    console.error(e);
    error.value = "에러 로그를 불러오지 못했습니다.";
  } finally {
    loading.value = false;
  }
}

function onSearch() {
  page.value = 0;
  load();
}

function changePage(p) {
  if (p < 0 || p >= totalPages.value) return;
  page.value = p;
  load();
}

function statusClass(code) {
  if (code >= 500) return "bg-danger";
  if (code >= 400) return "bg-warning text-dark";
  return "bg-success";
}

onMounted(load);
defineExpose({ reload: load });
</script>

<style scoped>
/* ===== 테이블 가로 대응 ===== */
.error-log-table {
  min-width: 1400px;
}

/* ===== 고정 폭 컬럼 ===== */
.col-time   { width: 170px; }
.col-method { width: 90px; }
.col-status { width: 80px; }
.col-user   { width: 120px; }
.col-ip     { width: 150px; }

/* ===== 텍스트 처리 ===== */
.text-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}

.text-wrap {
  white-space: normal;
  word-break: break-all;
}
</style>
