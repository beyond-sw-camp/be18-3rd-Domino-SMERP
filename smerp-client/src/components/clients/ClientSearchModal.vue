<template>
  <div class="modal fade" tabindex="-1" aria-labelledby="clientSearchModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="clientSearchModalLabel">거래처 검색</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <input type="text" class="form-control" placeholder="거래처명 검색" v-model="searchTerm" @input="onSearch">
          </div>
          <table class="table table-hover">
            <thead>
              <tr>
                <th>회사명</th>
                <th>사업자번호</th>
                <th>대표자명</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="client in filteredClients" :key="client.businessNumber">
                <td>{{ client.companyName }}</td>
                <td>{{ client.businessNumber }}</td>
                <td>{{ client.ceoName }}</td>
                <td>
                  <button class="btn btn-sm btn-primary" @click="selectClient(client)" data-bs-dismiss="modal">선택</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { fetchClients } from '@/api/client';

const clients = ref([]);
const searchTerm = ref('');

const emit = defineEmits(['select']);

async function loadClients() {
  try {
    const response = await fetchClients();
    clients.value = response.data.content;
  } catch (error) {
    console.error('Error fetching clients:', error);
  }
}

const filteredClients = computed(() => {
  if (!searchTerm.value) {
    return clients.value;
  }
  return clients.value.filter(client =>
    client.companyName.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

function selectClient(client) {
  emit('select', client);
}

function onSearch() {
  // The computed property will automatically update the list
}

onMounted(() => {
  loadClients();
});
</script>
