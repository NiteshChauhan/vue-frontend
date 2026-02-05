<template>
  <div class="invoice">
    <h2>Purchase Invoice</h2>

    <div class="info">
      <div><strong>Supplier:</strong> {{ data.supplierId?.name }}</div>
      <div><strong>Date:</strong> {{ formatDate(data.invoiceDate) }}</div>
      <div><strong>Status:</strong> {{ data.status }}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th style=" text-align:left;">Product</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="i in data.items" :key="i._id">
          <td style=" text-align:left;" >{{ i.productId?.name }}</td>
          <td>{{ i.quantity }}</td>
          <td>₹ {{ i.rate }}</td>
          <td>₹ {{ i.amount }}</td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <div>Subtotal: ₹ {{ data.subtotal }}</div>
      <div>Tax: ₹ {{ data.tax }}</div>
      <div><strong>Total: ₹ {{ data.totalAmount }}</strong></div>
      <div>Paid: ₹ {{ data.paidAmount }}</div>
    </div>

    <div class="payments" v-if="payments.length">
      <h3>Payments</h3>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Mode</th>
            <th>Ref No</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="p in payments" :key="p._id">
            <td>{{ formatDate(p.paymentDate) }}</td>
            <td>{{ p.paymentMode }}</td>
            <td>{{ p.referenceNo || "-" }}</td>
            <td>₹ {{ p.amount }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <button @click="openPDF">Download PDF</button>
    <router-link
        class="btn"
        :to="`/purchase/${data._id}/payment`"
      >
        Make Payment
      </router-link>

    <router-link to="/purchase">← Back</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import http from "@/api/http";
import { useAuthStore } from "@/stores/authStore";

const route = useRoute();
const data = ref({ items: [] });
const payments = ref([]);

onMounted(async () => {
  data.value = (await http.get(`/purchase/${route.params.id}`)).data;
  payments.value = (await http.get(`/payments/invoice/${route.params.id}`)).data;
});

const formatDate = d =>
  new Date(d).toLocaleDateString();

  const auth = useAuthStore();

  const openPDF = () => {
    const token = auth.token;

    window.open(
      `${import.meta.env.VITE_API_URL}/invoice-pdf/purchase/${route.params.id}?token=${token}`,
      "_blank"
    );
};
</script>

<style scoped>
.invoice {
  max-width: 900px;
  margin: auto;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
  text-align:right;
}

.totals {
  text-align: right;
  margin-top: 20px;
}
</style>
