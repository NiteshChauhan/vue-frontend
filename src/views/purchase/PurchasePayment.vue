<template>
  <div class="card">
    <h2>Purchase Payment</h2>

    <!-- INVOICE INFO -->
    <div class="info">
      <div><strong>Supplier:</strong> {{ supplier.name }}</div>
      <div><strong>Invoice Total:</strong> ₹ {{ invoice.totalAmount }}</div>
      <div><strong>Paid:</strong> ₹ {{ invoice.paidAmount }}</div>
      <div class="balance">
        <strong>Balance:</strong> ₹ {{ balance }}
      </div>
    </div>

    <hr />

    <!-- PAYMENT FORM -->
    <div class="form">
      <label>Payment Amount</label>
      <input
        type="number"
        v-model.number="amount"
        :max="balance"
        min="1"
        :disabled="balance <= 0"
      />

      <small v-if="amount > balance" class="error">
        Amount cannot exceed remaining balance
      </small>

      <label>Payment Mode</label>
      <select v-model="paymentMode">
        <option value="CASH">CASH</option>
        <option value="UPI">UPI</option>
        <option value="BANK">BANK</option>
        <option value="CHEQUE">CHEQUE</option>
      </select>

      <label>Reference No</label>
      <input v-model="referenceNo" />

      <label>Remarks</label>
      <textarea v-model="remarks"></textarea>

      <button
        @click="save"
        :disabled="!canSave"
        class="btn-primary"
      >
        Save Payment
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

const invoice = ref({
  totalAmount: 0,
  paidAmount: 0
});
const supplier = ref({});

const amount = ref(0);
const paymentMode = ref("CASH");
const referenceNo = ref("");
const remarks = ref("");

onMounted(async () => {
  const res = await http.get(`/purchase/${route.params.id}`);

  invoice.value = {
    totalAmount: res.data.totalAmount,
    paidAmount: res.data.paidAmount
  };

  supplier.value = res.data.supplierId;
});

// 🔹 Remaining balance
const balance = computed(() => {
  return invoice.value.totalAmount - invoice.value.paidAmount;
});

// 🔹 Can save validation
const canSave = computed(() => {
  return (
    amount.value > 0 &&
    amount.value <= balance.value &&
    balance.value > 0
  );
});

const save = async () => {
  try {
    const payload = {
      partyType: "SUPPLIER",
      partyId: supplier.value._id,
      invoiceType: "PURCHASE",
      invoiceId: route.params.id,
      amount: Number(amount.value),
      paymentMode: paymentMode.value,
      referenceNo: referenceNo.value,
      remarks: remarks.value
    };

    await http.post("/payments", payload);

    alert("Payment saved successfully");
    router.push(`/purchase/${route.params.id}`);
  } catch (err) {
    alert(err.response?.data?.error || "Payment failed");
  }
};
</script>

<style scoped>
.card {
  max-width: 520px;
  margin: auto;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.info div {
  margin-bottom: 6px;
}

.balance {
  color: #dc2626;
  font-weight: bold;
}

.form label {
  display: block;
  margin-top: 12px;
  font-weight: 500;
}

input,
select,
textarea {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
}

textarea {
  resize: vertical;
}

.error {
  color: #dc2626;
  font-size: 13px;
}

.btn-primary {
  margin-top: 15px;
  width: 100%;
  background: #2563eb;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 6px;
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
</style>
