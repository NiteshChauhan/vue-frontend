<template>
  <div class="invoice">
    <h2>Sales Invoice</h2>

    <!-- HEADER -->
    <div class="info">
      <div><strong>Customer:</strong> {{ data.vendorId?.name }}</div>
      <div><strong>Date:</strong> {{ formatDate(data.invoiceDate) }}</div>
      <div><strong>Status:</strong> {{ data.status }}</div>
    </div>

    <!-- ITEMS -->
    <table>
      <thead>
        <tr>
          <th style="text-align: left">Product</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="i in data.items" :key="i._id">
          <td style="text-align: left">{{ i.productId?.name }}</td>
          <td>{{ i.quantity }}</td>
          <td>₹ {{ i.rate }}</td>
          <td>₹ {{ i.amount }}</td>
        </tr>
      </tbody>
    </table>

    <!-- TOTALS -->
    <div class="totals">
      <div>Subtotal: ₹ {{ data.subtotal }}</div>
      <div>Tax: ₹ {{ data.tax }}</div>
      <div>
        <strong>Total: ₹ {{ data.totalAmount }}</strong>
      </div>
      <div>Paid: ₹ {{ data.paidAmount }}</div>
      <div>
        <strong>Balance: ₹ {{ balance }}</strong>
      </div>
    </div>

    <!-- ACTIONS -->
    <div class="actions">
      <router-link
        v-if="balance > 0"
        :to="`/sales/${data._id}/receipt`"
        class="btn green"
      >
        + Receive Payment
      </router-link>

      <button class="btn blue" @click="openPDF">Download PDF</button>

      <router-link to="/sales" class="btn gray"> ← Back </router-link>
    </div>

    <!-- PAYMENTS -->
    <div v-if="payments.length" class="payments">
      <h3>Receipts</h3>

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
            <td>{{ formatDate(p.createdAt) }}</td>
            <td>{{ p.paymentMode }}</td>
            <td>{{ p.referenceNo || "-" }}</td>
            <td>₹ {{ p.amount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import http from "@/api/http";

const route = useRoute();

const data = ref({ items: [] });
const payments = ref([]);

onMounted(async () => {
  data.value = (await http.get(`/sales/${route.params.id}`)).data;

  payments.value = (
    await http.get(`/payments/invoice/${route.params.id}`)
  ).data;
});

const balance = computed(() => data.value.totalAmount - data.value.paidAmount);

const formatDate = (d) => new Date(d).toLocaleDateString();

const openPDF = () => {
  window.open(
    `${import.meta.env.VITE_API_URL}/invoice-pdf/sales/${route.params.id}?token=${localStorage.getItem("token")}`,
    "_blank",
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

th,
td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
  text-align: right;
}

.totals {
  margin-top: 15px;
  text-align: right;
}

.actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 12px;
  text-decoration: none;
  color: white;
  border-radius: 5px;
}

.green {
  background: #16a34a;
}
.blue {
  background: #2563eb;
}
.gray {
  background: #6b7280;
}

.payments {
  margin-top: 30px;
}
</style>
