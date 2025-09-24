<template>
    <div>
        <h1>BOM 소요량 계산</h1>
        <button @click="openItemSearchModal">품목 찾기</button>
        <ItemSearchModal ref="itemSearchModalRef" @select="onItemSelect" />
        <BomTree v-if="bomData" :bomData="bomData" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ItemSearchModal from '@/components/items/ItemSearchModal.vue';
import BomTree from '@/components/boms/BomTree.vue';
import { getBomRequirements } from '@/api/bom';

const bomData = ref(null);
const itemSearchModalRef = ref(null);

const openItemSearchModal = () => {
    itemSearchModalRef.value?.showModal();
};

const onItemSelect = async (item) => {
    try {
        bomData.value = await getBomRequirements(item.itemId);
    } catch (error) {
        console.error('BOM 데이터 조회 실패:', error);
        alert('BOM 데이터를 불러오는 데 실패했습니다.');
    }
    // 모달은 자동으로 닫힙니다.
};
</script>

<style scoped>
h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
}

button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
}

button:hover {
    background-color: #0056b3;
}
</style>