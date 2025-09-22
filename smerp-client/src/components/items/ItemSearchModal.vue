<template>
  <div class="modal fade" tabindex="-1" aria-labelledby="itemSearchModalLabel" aria-hidden="true">
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
              <tr v-for="item in filteredItems" :key="item.itemId">
                <td>{{ item.name }}</td>
                <td>{{ item.rfid }}</td>
                <td>
                  <button class="btn btn-sm btn-primary" @click="selectItem(item)" data-bs-dismiss="modal">선택</button>
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
import { fetchItems } from '@/api/item';

const items = ref([]);
const searchTerm = ref('');

const emit = defineEmits(['select']);

async function loadItems() {
  try {
    // Fetch all items, assuming the list is not excessively long.
    // For very large datasets, server-side searching would be better.
    const response = await fetchItems(0, 1000); // Fetch up to 1000 items
    items.value = response.data.content;
  } catch (error) {
    console.error('Error fetching items:', error);
  }
}

const filteredItems = computed(() => {
  if (!searchTerm.value) {
    return items.value;
  }
  return items.value.filter(item =>
    item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

function selectItem(item) {
  emit('select', item);
}

function onSearch() {
  // The computed property will automatically update the list
}

onMounted(() => {
  loadItems();
});
</script>
