<template>
  <div class="ledger-card">
    <h2>Supplier Ledger</h2>

    <div class="supplier-info">
      <div><strong>Name:</strong> {{ supplier.name }}</div>
      <div><strong>Opening Balance:</strong> ₹ {{ supplier.openingBalance }}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th style=" text-align: left;">Date</th>
          <th style=" text-align: left;">Particulars</th>
          <th>Debit (₹)</th>
          <th>Credit (₹)</th>
          <th>Balance (₹)</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(l, i) in ledger" :key="i">
          <td style=" text-align: left;">{{ formatDate(l.date) }}</td>
          <td style=" text-align: left;">{{ l.particulars }}</td>
          <td class="num debit">{{ l.debit || "-" }}</td>
          <td class="num credit">{{ l.credit || "-" }}</td>
          <td class="num balance">{{ l.balance }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import http from "@/api/http";

const route = useRoute();
const supplier = ref({});
const ledger = ref([]);

onMounted(async () => {
  const res = await http.get(`/supplier-ledger/${route.params.id}`);
  supplier.value = res.data.supplier;
  ledger.value = res.data.ledger;
});

const formatDate = d =>
  new Date(d).toLocaleDateString();
</script>

<style scoped>
.ledger-card {
  max-width: 1000px;
  margin: auto;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.supplier-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
  text-align: right;
}

.num {
  text-align: right;
}

.debit {
  color: #dc2626;
}

.credit {
  color: #16a34a;
}

.balance {
  font-weight: bold;
}
</style>
