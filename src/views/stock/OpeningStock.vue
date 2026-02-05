<template>
  <div class="stock-card">
    <h2 class="title">Opening Stock</h2>

    <!-- Product Info -->
    <div class="product-info">
      <div><strong>Product:</strong> {{ product.name }}</div>
      <div><strong>SKU:</strong> {{ product.sku }}</div>
    </div>

    <!-- If already exists -->
    <div v-if="alreadyAdded" class="already">
      <p>⚠ Opening stock already added</p>

      <div class="summary">
        <div><strong>Quantity:</strong> {{ existing.quantity }}</div>
        <div><strong>Rate:</strong> ₹ {{ existing.rate }}</div>
        <div><strong>Total:</strong> ₹ {{ existing.amount }}</div>
      </div>

      <router-link to="/products" class="btn-secondary">
        Back to Products
      </router-link>
    </div>

    <!-- Entry Form -->
    <form v-else @submit.prevent="submit">
      <div class="form-group">
        <label>Quantity *</label>
        <input
          type="number"
          v-model.number="form.quantity"
          required
          min="0.01"
          step="0.01"
          autofocus
        />
      </div>

      <div class="form-group">
        <label>Rate</label>
        <input
          type="number"
          v-model.number="form.rate"
          min="0"
          step="0.01"
        />
      </div>

      <div class="form-group readonly">
        <label>Total</label>
        <input :value="total" readonly />
      </div>

      <p v-if="message" :class="type" class="message">
        {{ message }}
      </p>

      <button class="btn-primary">
        Save Opening Stock
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import http from "@/api/http";

const route = useRoute();
const router = useRouter();

const productId = route.params.productId;

/* STATE */
const product = ref({});
const existing = ref({});
const alreadyAdded = ref(false);

const form = reactive({
  quantity: 0,
  rate: 0
});

const message = ref("");
const type = ref("");

/* TOTAL */
const total = computed(() =>
  (form.quantity * form.rate).toFixed(2)
);

/* LOAD DATA */
onMounted(async () => {
  try {
    const prodRes = await http.get(`/products/${productId}`);
    product.value = prodRes.data;

    const stockRes = await http.get(`/opening-stock/${productId}`);
    if (stockRes.data.exists==true) {
      alreadyAdded.value = true;
      existing.value = stockRes.data;
    }
  } catch (err) {
    // no opening stock exists → allowed
  }
});

/* SUBMIT */
const submit = async () => {
  try {
    if (form.quantity <= 0) {
      message.value = "Quantity must be greater than zero";
      type.value = "error";
      return;
    }

    await http.post("/opening-stock", {
      productId,
      quantity: form.quantity,
      rate: form.rate
    });

    message.value = "Opening stock added successfully";
    type.value = "success";

    setTimeout(() => router.push("/products"), 1000);
  } catch (err) {
    message.value =
      err.response?.data?.message ||
      "Failed to add opening stock";
    type.value = "error";
  }
};
</script>

<style scoped>
.stock-card {
  max-width: 520px;
  margin: 30px auto;
  padding: 25px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,.05);
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.product-info {
  background: #f8fafc;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 5px;
  font-size: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.readonly input {
  background: #f3f4f6;
}

label {
  font-weight: 600;
  margin-bottom: 5px;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-secondary {
  display: inline-block;
  margin-top: 15px;
  color: #2563eb;
  font-weight: 600;
}

.message {
  text-align: center;
  margin-bottom: 10px;
}

.success {
  color: green;
}

.error {
  color: red;
}

.already {
  text-align: center;
}

.summary {
  margin-top: 10px;
  font-size: 14px;
}

/* 📱 Mobile */
@media (max-width: 600px) {
  .stock-card {
    margin: 15px;
  }
}
</style>
