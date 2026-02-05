<template>
  <div v-if="message" :class="['alert', type]">
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  message: String,
  type: {
    type: String,
    default: "error" // success | error | info
  }
});
</script>

<style scoped>
.alert {
  padding: 10px;
  margin: 10px 0;
  border-radius: 6px;
  font-size: 14px;
}

.success {
  background: #dcfce7;
  color: #166534;
}

.error {
  background: #fee2e2;
  color: #991b1b;
}

.info {
  background: #e0f2fe;
  color: #075985;
}
</style>
