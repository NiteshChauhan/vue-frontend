<template>
  <div class="card">
    <h2>Create Sales Invoice</h2>

    <label>Customer</label>
    <select v-model="vendorId">
      <option value="">Select Customer</option>
      <option v-for="v in vendors" :key="v._id" :value="v._id">
        {{ v.name }}
      </option>
    </select>

    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Amount</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(i, idx) in items" :key="idx">
          <td>
            <select v-model="i.productId">
              <option value="">Select</option>
              <option v-for="p in products" :value="p._id">
                {{ p.name }}
              </option>
            </select>
          </td>
          <td><input type="number" v-model.number="i.quantity" /></td>
          <td><input type="number" v-model.number="i.rate" /></td>
          <td>₹ {{ i.quantity * i.rate || 0 }}</td>
          <td>
            <button @click="remove(idx)">❌</button>
          </td>
        </tr>
      </tbody>
    </table>

    <button @click="add">+ Add Item</button>

    <label>Tax</label>
    <input type="number" v-model.number="tax" />

    <label>Paid Amount (optional)</label>
    <input type="number" v-model.number="paidAmount" />

    <div class="total">Total: ₹ {{ total }}</div>

    <button class="save" @click="save">Save Invoice</button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import http from "@/api/http";

const router = useRouter();

const vendors = ref([]);
const products = ref([]);

const vendorId = ref("");
const items = ref([{ productId: "", quantity: 1, rate: 0 }]);
const tax = ref(0);
const paidAmount = ref(0);

onMounted(async () => {
  vendors.value = (await http.get("/vendors")).data;
  products.value = (await http.get("/products")).data;
});

const add = () => items.value.push({ productId: "", quantity: 1, rate: 0 });

const remove = (i) => items.value.splice(i, 1);

const total = computed(
  () => items.value.reduce((t, i) => t + i.quantity * i.rate, 0) + tax.value,
);

const save = async () => {
  await http.post("/sales", {
    vendorId: vendorId.value,
    items: items.value,
    tax: tax.value,
    paidAmount: paidAmount.value,
  });

  router.push("/sales");
};
</script>

<style scoped>
.card {
  max-width: 900px;
  margin: auto;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

table {
  width: 100%;
  margin: 10px 0;
}

input,
select {
  width: 100%;
  padding: 6px;
}

.save {
  background: #16a34a;
  color: white;
  padding: 10px;
  margin-top: 10px;
}
</style>
