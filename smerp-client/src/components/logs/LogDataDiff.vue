<template>
  <div class="table-responsive">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>항목</th>
          <th>이전데이터</th>
          <th>변경후데이터</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="field in allFields" :key="field" :class="{ 'table-info': isChanged(field) }">
          <td>{{ field }}</td>
          <td>{{ before[field] }}</td>
          <td>{{ after[field] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  beforeData: String,
  afterData: String,
});

const before = ref({});
const after = ref({});

function parseData(dataString) {
  if (!dataString) return {};
  const obj = {};
  const regex = /([\w-]+)=([^,)]+)/g;
  let match;
  while ((match = regex.exec(dataString)) !== null) {
    obj[match[1]] = match[2];
  }

  if (obj.client) {
    const companyNameMatch = /companyName=([^,)]+)/.exec(obj.client);
    if (companyNameMatch) {
      obj.client_companyName = companyNameMatch[1];
    }
    delete obj.client;
  }

  return obj;
}

onMounted(() => {
  before.value = parseData(props.beforeData);
  after.value = parseData(props.afterData);
});

const allFields = computed(() => {
  const fields = new Set([...Object.keys(before.value), ...Object.keys(after.value)]);
  return Array.from(fields);
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
