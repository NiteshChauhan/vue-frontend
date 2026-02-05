<template>
  <div class="form-card">
    <h2>{{ isEdit ? "Edit Vendor" : "New Vendor" }}</h2>

    <div class="grid">
      <input v-model="form.name" placeholder="Vendor Name *" />
      <input v-model="form.phone" placeholder="Phone" />
      <input v-model="form.email" placeholder="Email" />
      <input v-model="form.gstNumber" placeholder="GST Number" />
    </div>

    <textarea
      v-model="form.address"
      placeholder="Address"
    ></textarea>

    <div class="grid">
      <input
        type="number"
        v-model.number="form.balance"
        placeholder="Opening Balance"
      />
    </div>

    <button class="btn" @click="save">
      Save Vendor
    </button>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import http from "@/api/http";

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => !!route.params.id);

const form = reactive({
  name: "",
  phone: "",
  email: "",
  address: "",
  gstNumber: "",
  openingBalance: 0
});

onMounted(async () => {
  if (isEdit.value) {
    const res = await http.get("/vendors");
    const v = res.data.find(x => x._id === route.params.id);
    Object.assign(form, v);
  }
});

const save = async () => {
  if (!form.name) {
    alert("Vendor name is required");
    return;
  }

  if (isEdit.value) {
    await http.put(`/vendors/${route.params.id}`, form);
  } else {
    await http.post("/vendors", form);
  }

  router.push("/vendors");
};
</script>

<style scoped>
.form-card {
  max-width: 600px;
  margin: auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}
input, textarea {
  padding: 8px;
}
textarea {
  margin-top: 10px;
}
.btn {
  margin-top: 20px;
  background: #2563eb;
  color: white;
  padding: 10px;
}
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
