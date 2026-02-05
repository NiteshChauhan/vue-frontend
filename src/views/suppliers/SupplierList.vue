<template>
  <div class="card">
    <div class="header">
      <h2>Suppliers</h2>
      <router-link to="/suppliers/create" class="btn">
        + Add Supplier
      </router-link>
    </div>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Phone</th>
          <th>GST</th>
          <th>Balance</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="s in suppliers" :key="s._id">
          <td>{{ s.name }}</td>
          <td>{{ s.phone }}</td>
          <td>{{ s.gstNumber }}</td>
          <td>₹ {{ s.balance }}</td>
          <td>
            <router-link :to="`/suppliers/edit/${s._id}`">Edit</router-link>
            |<router-link :to="`/suppliers/ledger/${s._id}`"> View Ledger </router-link>
            |<a href="#" @click.prevent="remove(s._id)">Delete</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import http from "@/api/http";

const suppliers = ref([]);

const load = async () => {
  suppliers.value = (await http.get("/suppliers")).data;
};

onMounted(load);

const remove = async id => {
  if (!confirm("Deactivate this supplier?")) return;
  await http.delete(`/suppliers/${id}`);
  load();
};
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
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 10px;
  border-bottom: 1px solid #eee;
  text-align:left;
}
.btn {
  background: #2563eb;
  color: white;
  padding: 4px 12px;
  border-radius: 6px;
}
</style>
