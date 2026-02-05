<template>
  <div class="card">
    <h4>{{ title }}</h4>
    <p>{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number]
});
</script>

<style scoped>
.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
}

h4 {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

p {
  margin-top: 10px;
  font-size: 22px;
  font-weight: bold;
}
</style>
