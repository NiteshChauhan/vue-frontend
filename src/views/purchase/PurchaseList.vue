<template>
  <div class="card">
    <div class="header">
      <h2>Purchase Invoices</h2>
      <router-link to="/purchase/create" class="btn">
        + New Purchase
      </router-link>
    </div>

    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Supplier</th>
          <th>Total</th>
          <th>Paid</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="inv in invoices" :key="inv._id">
          <td>{{ formatDate(inv.invoiceDate) }}</td>
          <td>{{ inv.supplierId?.name }}</td>
          <td>₹ {{ inv.totalAmount }}</td>
          <td>₹ {{ inv.paidAmount }}</td>
          <td>
            <span :class="['status', inv.status]">
              {{ inv.status }}
            </span>
          </td>
          <td>
            <router-link :to="`/purchase/${inv._id}`">
              View
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import http from "@/api/http";

const invoices = ref([]);

onMounted(async () => {
  invoices.value = (await http.get("/purchase")).data;
});

const formatDate = d =>
  new Date(d).toLocaleDateString();
</script>

<style scoped>
.card {
  background: white;
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
th, td {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.status {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.PAID { background: #dcfce7; color: #166534 }
.PARTIAL { background: #fef9c3; color: #854d0e }
.DUE { background: #fee2e2; color: #991b1b }
.btn {
  background: #2563eb;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
}
</style>
