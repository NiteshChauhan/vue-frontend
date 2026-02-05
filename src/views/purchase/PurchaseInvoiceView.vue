<template>
  <div class="invoice">
    <div class="top">
      <h2>Purchase Invoice</h2>

      <div class="actions">
        <button @click="openPDF">Download PDF</button>
        <router-link to="/purchase">Back</router-link>
      </div>
    </div>

    <!-- COMPANY -->
    <div class="block">
      <strong>{{ company.name }}</strong><br />
      {{ company.address }}
    </div>

    <!-- SUPPLIER -->
    <div class="block">
      <strong>Supplier:</strong> {{ supplier.name }}<br />
      {{ supplier.phone }}
    </div>

    <!-- ITEMS -->
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="i in invoice.items" :key="i._id">
          <td>{{ i.productId?.name }}</td>
          <td>{{ i.quantity }}</td>
          <td>₹ {{ i.rate }}</td>
          <td>₹ {{ i.amount }}</td>
        </tr>
      </tbody>
    </table>

    <!-- TOTALS -->
    <div class="totals">
      <div>Subtotal: ₹ {{ invoice.subtotal }}</div>
      <div>Tax: ₹ {{ invoice.tax }}</div>
      <div><strong>Total: ₹ {{ invoice.totalAmount }}</strong></div>
      <div>Paid: ₹ {{ invoice.paidAmount }}</div>
      <div>Status: {{ invoice.status }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import http from "@/api/http";

const route = useRoute();

const invoice = ref({});
const company = ref({});
const supplier = ref({});

onMounted(async () => {
  const res = await http.get(`/purchase/${route.params.id}`);
  invoice.value = res.data.invoice;
  company.value = res.data.company;
  supplier.value = res.data.supplier;
});

const openPDF = () => {
  window.open(
    `${import.meta.env.VITE_API_URL}/invoice/purchase/${route.params.id}`,
    "_blank"
  );
};
</script>

<style scoped>
.invoice {
  max-width: 900px;
  margin: auto;
  background: white;
  padding: 20px;
}
.top {
  display: flex;
  justify-content: space-between;
}
.actions button {
  background: #2563eb;
  color: white;
  padding: 6px 10px;
  margin-right: 10px;
}
.block {
  margin: 15px 0;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
}
.totals {
  margin-top: 20px;
  text-align: right;
}
</style>
