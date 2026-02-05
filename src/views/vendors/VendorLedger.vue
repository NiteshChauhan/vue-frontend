<template>
  <div class="ledger-card" v-if="loaded">
    <h2>Customer Ledger</h2>

    <div class="header">
      <div><strong>Name:</strong> {{ vendor.name }}</div>
      <div><strong>Opening Balance:</strong> ₹ {{ vendor.openingBalance }}</div>
      <div><strong>Closing Balance:</strong> ₹ {{ closingBalance }}</div>
    </div>

    <table v-if="ledger.length">
      <thead>
        <tr>
          <th>Date</th>
          <th>Particulars</th>
          <th>Debit (₹)</th>
          <th>Credit (₹)</th>
          <th>Balance (₹)</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(l, i) in ledger" :key="i">
          <td>{{ formatDate(l.date) }}</td>
          <td>{{ l.particulars }}</td>
          <td class="debit">{{ l.debit ? l.debit : "-" }}</td>
          <td class="credit">{{ l.credit ? l.credit : "-" }}</td>
          <td>{{ l.balance }}</td>
        </tr>
      </tbody>
    </table>

    <div v-else class="empty">No ledger entries</div>

    <router-link to="/vendors">← Back</router-link>
  </div>

  <div v-else class="loading">Loading ledger...</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import http from "@/api/http";

const route = useRoute();

const vendor = ref({
  name: "",
  openingBalance: 0,
});
const ledger = ref([]);
const closingBalance = ref(0);
const loaded = ref(false);

onMounted(async () => {
  try {
    // ✅ SUPPORT BOTH id & vendorId
    const vendorId = route.params.vendorId || route.params.id;

    const res = await http.get(`/vendors/${vendorId}/ledger`);

    vendor.value = res.data.vendor;
    ledger.value = res.data.ledger;
    closingBalance.value = res.data.closingBalance;
  } catch (err) {
    console.error("Ledger load failed:", err);
    alert("Failed to load vendor ledger");
  } finally {
    loaded.value = true;
  }
});

const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "-");
</script>

<style scoped>
.ledger-card {
  max-width: 1000px;
  margin: auto;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
}

.debit {
  color: #dc2626;
  text-align: right;
}

.credit {
  color: #059669;
  text-align: right;
}

.loading {
  text-align: center;
  margin-top: 50px;
}

.empty {
  text-align: center;
  color: #777;
}
</style>
