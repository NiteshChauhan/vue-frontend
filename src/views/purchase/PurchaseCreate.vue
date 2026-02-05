<template>
  <div class="invoice-card">
    <h2 class="title">Purchase Invoice</h2>

    <!-- HEADER -->
    <div class="header-grid">
      <div>
        <label>Supplier</label>
        <select v-model="form.supplierId">
          <option value="">Select Supplier</option>
          <option v-for="s in suppliers" :key="s._id" :value="s._id">
            {{ s.name }}
          </option>
        </select>
      </div>

      <div>
        <label>Invoice Date</label>
        <input type="date" v-model="form.invoiceDate" />
      </div>
    </div>

    <!-- ITEMS -->
    <table class="items">
      <thead>
        <tr>
          <th>Product</th>
          <th>Stock</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Amount</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(i, index) in form.items" :key="index">
          <td>
            <select v-model="i.productId" @change="onProductChange(i)">
              <option value="">Select</option>
              <option v-for="p in products" :key="p._id" :value="p._id">
                {{ p.name }}
              </option>
            </select>
          </td>

          <!-- AVAILABLE STOCK -->
          <td class="num">
            {{ i.availableStock ?? "-" }}
          </td>

          <td>
            <input type="number" min="1" v-model.number="i.quantity" />
          </td>

          <td>
            <input type="number" min="0" v-model.number="i.rate" />
          </td>

          <td class="num">
            {{ i.quantity * i.rate || 0 }}
          </td>

          <td>
            <button class="remove" @click="removeItem(index)">×</button>
          </td>
        </tr>
      </tbody>
    </table>

    <button class="add" @click="addItem">+ Add Item</button>

    <!-- TOTALS -->
    <div class="totals">
      <div>Subtotal: ₹ {{ subtotal }}</div>

      <div>
        Tax:
        <input type="number" v-model.number="form.tax" />
      </div>

      <div><strong>Total: ₹ {{ total }}</strong></div>

      <div>
        Paid:
        <input type="number" v-model.number="form.paidAmount" />
      </div>
    </div>

    <button class="btn-primary" @click="save">
      Save Purchase
    </button>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { createPurchaseApi } from "@/api/purchaseApi";
import http from "@/api/http";
import { useRouter } from "vue-router";

const router = useRouter();

const suppliers = ref([]);
const products = ref([]);

const form = reactive({
  supplierId: "",
  invoiceDate: "",
  items: [createItem()],
  tax: 0,
  paidAmount: 0
});

function createItem() {
  return {
    productId: "",
    quantity: 1,
    rate: 0,
    availableStock: null
  };
}

onMounted(async () => {
  suppliers.value = (await http.get("/suppliers")).data;
  products.value = (await http.get("/products")).data;
});

/* 🔄 When product selected */
const onProductChange = async (item) => {
  if (!item.productId) return;

  // 1️⃣ Get product (for rate / GST later)
  const product = products.value.find(p => p._id === item.productId);

  // 2️⃣ Get available stock
  const stockRes = await http.get(`/stock/${item.productId}`);
  item.availableStock = stockRes.data.stock;

  // 3️⃣ Auto rate (fallback safe)
  item.rate = product?.lastPurchaseRate || 0;
  item.quantity = 1;
};

const addItem = () => form.items.push(createItem());
const removeItem = i => form.items.splice(i, 1);

const subtotal = computed(() =>
  form.items.reduce((t, i) => t + i.quantity * i.rate, 0)
);

const total = computed(() => subtotal.value + form.tax);

const save = async () => {
  await createPurchaseApi(form);
  router.push("/purchase");
};
</script>
<style scoped>
.invoice-card {
  max-width: 1100px;
  margin: auto;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.title {
  margin-bottom: 15px;
}

.header-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 15px;
}

label {
  font-weight: 600;
  margin-bottom: 5px;
  display: block;
}

input,
select {
  width: 100%;
  padding: 8px;
}

.items {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.items th,
.items td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
}

.num {
  text-align: right;
}

.add {
  margin-top: 10px;
}

.remove {
  background: #dc2626;
  color: white;
  border: none;
  padding: 4px 8px;
}

.totals {
  margin-top: 20px;
  text-align: right;
}

.btn-primary {
  margin-top: 20px;
  padding: 12px;
  width: 100%;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
}

/* 📱 Mobile */
@media (max-width: 768px) {
  .header-grid {
    grid-template-columns: 1fr;
  }

  .items {
    font-size: 12px;
  }
}
</style>
