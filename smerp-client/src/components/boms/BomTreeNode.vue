<template>
    <tr :style="{ 'background-color': depthColor }">
        <td>{{ node.depth }}</td>
        <td :style="{ 'padding-left': depthPadding }">{{ node.itemName }}</td>
        <td>{{ node.itemStatus }}</td>
        <td>{{ node.qty }}</td>
        <td>{{ formatCurrency(node.unitCost) }}</td>
        <td>{{ formatCurrency(node.totalCost) }}</td>
    </tr>
    <BomTreeNode v-for="child in node.children" :key="child.itemId" :node="child" />
</template>

<script setup>
import { computed } from 'vue';
import BomTreeNode from './BomTreeNode.vue';

const props = defineProps({
    node: Object
});

const depthPadding = computed(() => {
    return `${props.node.depth * 20 + 8}px`;
});

const depthColor = computed(() => {
    const colors = ['#ffffff', '#f0f8ff', '#e6f2ff', '#dcf0ff', '#d2ecff'];
    return colors[props.node.depth] || colors[colors.length - 1];
});

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
};

</script>

<style scoped>
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}
</style>