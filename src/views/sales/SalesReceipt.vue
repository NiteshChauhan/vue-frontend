<template>
  <div class="card">
    <h2>Sales Receipt</h2>

    <div class="info">
      <div><strong>Customer:</strong> {{ vendor.name }}</div>
      <div><strong>Invoice Total:</strong> ₹ {{ invoice.totalAmount }}</div>
      <div><strong>Already Paid:</strong> ₹ {{ invoice.paidAmount }}</div>
      <div><strong>Balance:</strong> ₹ {{ balance }}</div>
    </div>

    <div class="form">
      <label>Receipt Amount</label>
      <input type="number" v-model.number="amount" :max="balance" />

      <label>Payment Mode</label>
      <select v-model="paymentMode">
        <option>CASH</option>
        <option>UPI</option>
        <option>BANK</option>
        <option>CHEQUE</option>
      </select>

      <label>Reference No</label>
      <input v-model="referenceNo" />

      <label>Remarks</label>
      <textarea v-model="remarks"></textarea>

      <button :disabled="amount <= 0 || amount > balance" @click="save">
        Save Receipt
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import http from "@/api/http";

const route = useRoute();
const router = useRouter();

const invoice = ref({});
const vendor = ref({});

const amount = ref(0);
const paymentMode = ref("CASH");
const referenceNo = ref("");
const remarks = ref("");

onMounted(async () => {
  const res = await http.get(`/sales/${route.params.id}`);
  invoice.value = res.data;
  vendor.value = res.data.vendorId;
});

const balance = computed(
  () => invoice.value.totalAmount - invoice.value.paidAmount,
);

const save = async () => {
  try {
    if (amount.value > balance.value) {
      alert("Receipt exceeds balance");
      return;
    }

    const payload = {
      partyType: "VENDOR",
      partyId: vendor.value._id,
      invoiceType: "SALE",
      invoiceId: route.params.id,
      amount: Number(amount.value),
      paymentMode: paymentMode.value,
      referenceNo: referenceNo.value,
      remarks: remarks.value,
    };

    await http.post("/payments", payload);

    alert("Receipt saved successfully");
    router.push(`/sales/${route.params.id}`);
  } catch (err) {
    alert(err.response?.data?.error || "Failed to save receipt");
  }
};
</script>

<style scoped>
.card {
  max-width: 500px;
  margin: auto;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.info div {
  margin-bottom: 6px;
}

.form label {
  display: block;
  margin-top: 12px;
}

input,
select,
textarea {
  width: 100%;
  padding: 8px;
}

button {
  margin-top: 15px;
  background: #16a34a;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}

button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
</style>
