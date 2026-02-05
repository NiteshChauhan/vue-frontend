<template>
  <div class="card">
    <div class="header">
      <h2>Sales Invoices</h2>
      <router-link to="/sales/create" class="btn"> + New Sale </router-link>
    </div>

    <table>
      <thead>
        <tr>
          <th>Invoice No</th>
          <th>Date</th>
          <th>Customer</th>
          <th>Total</th>
          <th>Paid</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="i in invoices" :key="i._id">
          <td>{{ i.invoiceNo }}</td>
          <td>{{ formatDate(i.invoiceDate) }}</td>
          <td>{{ i.vendorId?.name }}</td>
          <td>₹ {{ i.totalAmount }}</td>
          <td>₹ {{ i.paidAmount }}</td>
          <td>
            <span :class="`status ${i.status}`">
              {{ i.status }}
            </span>
          </td>
          <td>
            <router-link :to="`/sales/${i._id}`"> View </router-link>
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
  const res = await http.get("/sales");
  invoices.value = res.data;
});

const formatDate = (d) => new Date(d).toLocaleDateString();
</script>

<style scoped>
.card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.btn {
  background: #2563eb;
  color: #fff;
  padding: 8px 12px;
  border-radius: 5px;
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

.status.PAID {
  color: green;
}
.status.PARTIAL {
  color: orange;
}
.status.DUE {
  color: red;
}
</style>
