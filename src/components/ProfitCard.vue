<template>
  <div class="card">
    <h3>{{ title }}</h3>

    <p>Sales: ₹ {{ format(data.sales) }}</p>
    <p>Cost: ₹ {{ format(data.cost) }}</p>

    <h2 :class="data.profit >= 0 ? 'profit' : 'loss'">
      {{ data.profit >= 0 ? "Profit" : "Loss" }}: ₹ {{ format(data.profit) }}
    </h2>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  data: {
    type: Object,
    default: () => ({
      sales: 0,
      cost: 0,
      profit: 0,
    }),
  },
});

const format = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
</script>

<style scoped>
.card {
  background: #fff;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.profit {
  color: #059669;
}

.loss {
  color: #dc2626;
}
</style>
