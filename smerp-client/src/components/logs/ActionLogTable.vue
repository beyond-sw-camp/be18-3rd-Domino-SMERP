<template>
  <div class="card shadow-sm">
    <div class="card-body">

      <!-- ===== 필터 영역 ===== -->
      <div class="row g-2 mb-3">
        <div class="col-md-2">
          <select v-model="filters.action" class="form-select">
            <option value="">행위 전체</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        <div class="col-md-2">
          <input
            v-model="filters.entity"
            class="form-control"
            placeholder="엔티티"
          />
        </div>

        <div class="col-md-2">
          <input
            v-model="filters.entityId"
            class="form-control"
            placeholder="식별자"
          />
        </div>

        <div class="col-md-2">
          <select v-model="filters.success" class="form-select">
            <option value="">결과 전체</option>
            <option :value="true">성공</option>
            <option :value="false">실패</option>
          </select>
        </div>

        <div class="col-md-2">
          <input
            v-model="filters.actor"
            class="form-control"
            placeholder="수행자"
          />
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
              <th>행위</th>
              <th>엔티티</th>
              <th>식별자</th>
              <th>결과</th>
              <th>수행자</th>
              <th>IP</th>
              <th>사유</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="log in logs"
              :key="log.id"
              style="cursor:pointer"
              @click="goDetail(log.id)"
            >
              <td>{{ log.timestamp }}</td>

              <td>
                <span
                  class="badge"
                  :class="actionClass(log.action)"
                >
                  {{ log.action }}
                </span>
              </td>

              <td>{{ log.entity }}</td>

              <td class="text-mono">
                {{ log.entityId || "-" }}
              </td>

              <td>
                <span
                  class="badge"
                  :class="log.success ? 'bg-success' : 'bg-danger'"
                >
                  {{ log.success ? "성공" : "실패" }}
                </span>
              </td>

              <td>{{ log.actor }}</td>
              <td>{{ log.clientIp }}</td>

              <td class="text-muted small">
                {{ log.failReason || "-" }}
              </td>
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
import { useRouter } from "vue-router";
import { fetchActionLogs } from "@/api/log";

const router = useRouter();

const logs = ref([]);
const loading = ref(false);
const error = ref(null);

/* ===== 페이지네이션 ===== */
const page = ref(0);
const size = 20;
const totalPages = ref(0);

/* ===== 필터 ===== */
const filters = ref({
  action: "",
  entity: "",
  entityId: "",
  success: "",
  actor: "",
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

    const { data } = await fetchActionLogs(params);

    logs.value = data.content;
    totalPages.value = data.totalPages;
  } catch (e) {
    console.error(e);
    error.value = "행위 로그를 불러오지 못했습니다.";
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

/* ===== 상세 이동 ===== */
function goDetail(id) {
  router.push(`/logs/actions/${id}`);
}

/* ===== 뱃지 색상 ===== */
function actionClass(action) {
  switch (action) {
    case "CREATE":
      return "bg-primary";
    case "UPDATE":
      return "bg-warning text-dark";
    case "DELETE":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
}

/* ===== 필터 변경 시 페이지 초기화 ===== */
watch(filters, () => {
  page.value = 0;
}, { deep: true });

onMounted(load);

/* ===== 상위에서 새로고침 ===== */
defineExpose({ reload: load });
</script>

<style scoped>
.text-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}
</style>
