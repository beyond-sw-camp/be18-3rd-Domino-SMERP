<template>
  <div class="table-responsive">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>항목</th>
          <th>이전 데이터</th>
          <th>변경 후 데이터</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="field in fields"
          :key="field"
          :class="{ 'table-info': isChanged(field) }"
        >
          <td>{{ field }}</td>
          <td>{{ before[field] ?? "-" }}</td>
          <td>{{ after[field] ?? "-" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  beforeData: String,
  afterData: String,
});

function safeParse(json) {
  try {
    return json ? JSON.parse(json) : {};
  } catch {
    return {};
  }
}

const before = computed(() => safeParse(props.beforeData));
const after = computed(() => safeParse(props.afterData));

const fields = computed(() => {
  return Array.from(
    new Set([...Object.keys(before.value), ...Object.keys(after.value)])
  );
});

function isChanged(field) {
  return before.value[field] !== after.value[field];
}
</script>

<style scoped>
.table-info {
  --bs-table-bg: #cce5ff;
  --bs-table-border-color: #b8daff;
}
</style>
