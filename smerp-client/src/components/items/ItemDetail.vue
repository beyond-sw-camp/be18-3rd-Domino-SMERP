<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h5 class="card-title mb-4">품목 상세 정보</h5>
      <div v-if="showSuccessMessage" class="alert alert-success" role="alert">
        수정이 완료됐습니다.
      </div>

      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-else-if="item">
        <div v-if="!isEditing">
          <div class="row mb-3">
            <div class="col-md-4">
              <label class="form-label fw-bold">ID</label>
              <p class="form-control-static">{{ item.itemId }}</p>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-bold">품목명</label>
              <p class="form-control-static">{{ item.name }}</p>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-bold">단위</label>
              <p class="form-control-static">{{ item.unit }}</p>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-4">
              <label class="form-label fw-bold">품목상태</label>
              <p class="form-control-static">{{ item.itemStatus }}</p>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-bold">RFID</label>
              <p class="form-control-static">{{ item.rfid }}</p>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-bold">품목활동</label>
              <p class="form-control-static">{{ item.itemAct }}</p>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-4">
              <label class="form-label fw-bold">그룹1</label>
              <p class="form-control-static">{{ item.groupName1 }}</p>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-bold">그룹2</label>
              <p class="form-control-static">{{ item.groupName2 }}</p>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-bold">그룹3</label>
              <p class="form-control-static">{{ item.groupName3 }}</p>
            </div>
          </div>
        </div>

        <!-- Editing View -->
        <div v-else>
          <div class="row mb-3">
            <div class="col-md-4">
              <label class="form-label fw-bold">ID</label>
              <p class="form-control-static">{{ editableItem.itemId }}</p>
            </div>
            <div class="col-md-4">
              <label for="name" class="form-label fw-bold">품목명</label>
              <input id="name" v-model="editableItem.name" type="text" class="form-control">
            </div>
            <div class="col-md-4">
              <label for="unit" class="form-label fw-bold">단위</label>
              <input id="unit" v-model="editableItem.unit" type="text" class="form-control">
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-4">
              <label for="itemStatus" class="form-label fw-bold">품목상태</label>
              <input id="itemStatus" v-model="editableItem.itemStatus" type="text" class="form-control">
            </div>
            <div class="col-md-4">
              <label for="rfid" class="form-label fw-bold">RFID</label>
              <input id="rfid" v-model="editableItem.rfid" type="text" class="form-control">
            </div>
            <div class="col-md-4">
              <label for="itemAct" class="form-label fw-bold">품목활동</label>
              <input id="itemAct" v-model="editableItem.itemAct" type="text" class="form-control">
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-4">
              <label for="groupName1" class="form-label fw-bold">그룹1</label>
              <input id="groupName1" v-model="editableItem.groupName1" type="text" class="form-control">
            </div>
            <div class="col-md-4">
              <label for="groupName2" class="form-label fw-bold">그룹2</label>
              <input id="groupName2" v-model="editableItem.groupName2" type="text" class="form-control">
            </div>
            <div class="col-md-4">
              <label for="groupName3" class="form-label fw-bold">그룹3</label>
              <input id="groupName3" v-model="editableItem.groupName3" type="text" class="form-control">
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="d-flex justify-content-end gap-2 mt-4">
          <button type="button" class="btn btn-outline-secondary" @click="cancel">목록으로</button>
          <template v-if="!isEditing">
            <button type="button" class="btn btn-primary" @click="startEditing">수정</button>
          </template>
          <template v-else>
            <button type="button" class="btn btn-secondary" @click="cancelEditing">취소</button>
            <button type="button" class="btn btn-success" @click="saveItem">저장</button>
          </template>
        </div>
      </div>

      <div v-else class="text-center text-muted">
        품목 정보를 찾을 수 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { fetchItemDetail, updateItem } from "@/api/item";

const props = defineProps({
  itemId: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const route = useRoute();
const item = ref(null);
const loading = ref(true);
const error = ref(null);

const isEditing = ref(false);
const editableItem = ref(null);
const showSuccessMessage = ref(false);

async function loadItemDetail(id) {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetchItemDetail(id);
    item.value = response.data;
    // Check if the route has an 'edit' query parameter
    if (route.query.view === 'edit') {
      startEditing();
    }
  } catch (e) {
    console.error('Error fetching item details:', e);
    error.value = '품목 정보를 불러오는 데 실패했습니다.';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (props.itemId) {
    loadItemDetail(props.itemId);
  }
});

watch(() => props.itemId, (newItemId) => {
  if (newItemId) {
    loadItemDetail(newItemId);
  } else {
    item.value = null;
  }
});

function startEditing() {
  editableItem.value = JSON.parse(JSON.stringify(item.value));
  isEditing.value = true;
}

function cancelEditing() {
  editableItem.value = null;
  isEditing.value = false;
}

async function saveItem() {
  if (!editableItem.value) return;

  const changedData = {};
  const originalItem = item.value;
  const editedItem = editableItem.value;

  const editableFields = [
    'name',
    'unit',
    'itemStatus',
    'rfid',
    'itemAct',
    'groupName1',
    'groupName2',
    'groupName3',
  ];

  for (const key of editableFields) {
    if (originalItem[key] !== editedItem[key]) {
      changedData[key] = editedItem[key];
    }
  }

  if (Object.keys(changedData).length === 0) {
    isEditing.value = false;
    editableItem.value = null;
    return;
  }

  try {
    await updateItem(props.itemId, changedData);
    await loadItemDetail(props.itemId);

    isEditing.value = false;
    editableItem.value = null;
    showSuccessMessage.value = true;
    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 3000);
  } catch (err) {
    console.error('Failed to update item:', err);
    error.value = '품목 정보 수정에 실패했습니다.';
  }
}

function cancel() {
  router.push('/items');
}
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
  border: 1px solid transparent;
  border-radius: 8px;
  background-color: #f8f9fa;
  font-size: 0.95rem;
  color: #495057;
}
.btn-outline-secondary {
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
}
</style>


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
  border: 1px solid transparent;
  border-radius: 8px;
  background-color: #f8f9fa;
  font-size: 0.95rem;
  color: #495057;
}
.btn-outline-secondary {
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
}
</style>
