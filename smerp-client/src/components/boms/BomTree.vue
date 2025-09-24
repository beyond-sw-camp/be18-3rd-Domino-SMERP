<template>
    <div class="bom-tree">
        <table>
            <thead>
                <tr>
                    <th>레벨</th>
                    <th>품목명</th>
                    <th>품목 상태</th>
                    <th>수량</th>
                    <th>단가</th>
                    <th>총 비용</th>
                </tr>
            </thead>
            <tbody>
                <BomTreeNode :node="bomData" />
            </tbody>
        </table>
    </div>
</template>

<script setup>
import BomTreeNode from './BomTreeNode.vue';

defineProps({
    bomData: Object
});
</script>

<style scoped>
.bom-tree {
    margin-top: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

thead {
    background-color: #f2f2f2;
}

th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}
</style>