<template>
  <div class="modal fade" id="itemSearchModal" tabindex="-1" aria-labelledby="itemSearchModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="itemSearchModalLabel">품목 검색</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <input type="text" class="form-control" placeholder="품목명 검색" v-model="searchTerm" @input="onSearch">
          </div>
          <table class="table table-hover">
            <thead>
              <tr>
                <th>품목명</th>
                <th>RFID</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="items.length === 0">
                <td colspan="3" class="text-center text-muted">검색 결과가 없습니다.</td>
              </tr>
              <tr v-for="item in items" :key="item.itemId">
                <td>{{ item.name }}</td>
                <td>{{ item.rfid }}</td>
                <td>
                  <button class="btn btn-sm btn-primary" @click="selectItem(item)" data-bs-dismiss="modal">선택</button>
                </td>
              </tr>
            </tbody>
          </table>
          <Pagination
            :currentPage="currentPage"
            :totalPages="totalPages"
            @page-changed="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { fetchItems } from '@/api/item';
import Pagination from '@/components/common/Pagination.vue';

const items = ref([]);
const searchTerm = ref('');
const currentPage = ref(0);
const totalPages = ref(0);
const pageSize = ref(10);

const emit = defineEmits(['select']);

async function loadItems() {
  try {
    const response = await fetchItems(currentPage.value, pageSize.value, searchTerm.value);
    items.value = response.data.content;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Error fetching items:', error);
  }
}

watch(searchTerm, () => {
  currentPage.value = 0;
  loadItems();
});

function selectItem(item) {
  emit('select', item);
}

function onSearch() {
}

function handlePageChange(page) {
  currentPage.value = page;
  loadItems();
}

onMounted(() => {
  loadItems();
});
</script>