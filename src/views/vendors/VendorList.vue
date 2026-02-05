<template>
  <div class="card">
    <div class="header">
      <h2>Vendors</h2>
      <router-link to="/vendors/create" class="btn"> + Add Vendor </router-link>
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
        <tr v-for="v in vendors" :key="v._id">
          <td>{{ v.name }}</td>
          <td>{{ v.phone }}</td>
          <td>{{ v.gstNumber }}</td>
          <td>₹ {{ v.balance }}</td>
          <td>
            <router-link :to="`/vendors/edit/${v._id}`"> Edit </router-link>
            |
            <router-link :to="`/vendors/${v._id}/ledger`">
              View Ledger
            </router-link>
            |
            <a href="#" @click.prevent="remove(v._id)"> Delete </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import http from "@/api/http";

const vendors = ref([]);

const load = async () => {
  vendors.value = (await http.get("/vendors")).data;
};

onMounted(load);

const remove = async (id) => {
  if (!confirm("Deactivate this vendor?")) return;
  await http.delete(`/vendors/${id}`);
  load();
};
</script>

<style scoped>
.card {
  background: white;
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
th,
td {
  padding: 10px;
  border-bottom: 1px solid #eee;
  text-align: left;
}
.btn {
  background: #2563eb;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
}
</style>
