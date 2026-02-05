<template>
  <div class="card">
    <h2>Supplier Outstanding Report</h2>

    <table>
      <thead>
        <tr>
          <th>Supplier</th>
          <th>Total Purchase</th>
          <th>Paid</th>
          <th>Outstanding</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="s in report" :key="s.supplierId">
          <td>{{ s.supplierName }}</td>
          <td class="num">₹ {{ s.totalPurchase }}</td>
          <td class="num">₹ {{ s.totalPaid }}</td>
          <td
            class="num"
            :class="{ danger: s.outstanding > 0 }"
          >
            ₹ {{ s.outstanding }}
          </td>
          <td>
            <router-link
              :to="`/suppliers/ledger/${s.supplierId}`"
              class="link"
            >
              View Ledger
            </router-link>
          </td>
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <th>Total</th>
          <th class="num">₹ {{ totalPurchase }}</th>
          <th class="num">₹ {{ totalPaid }}</th>
          <th class="num">₹ {{ totalOutstanding }}</th>
          <th></th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import http from "@/api/http";

const report = ref([]);

onMounted(async () => {
  report.value = (await http.get("/reports/supplier-outstanding")).data;
});

const totalPurchase = computed(() =>
  report.value.reduce((t, r) => t + r.totalPurchase, 0)
);

const totalPaid = computed(() =>
  report.value.reduce((t, r) => t + r.totalPaid, 0)
);

const totalOutstanding = computed(() =>
  report.value.reduce((t, r) => t + r.outstanding, 0)
);
</script>

<style scoped>
.card {
  max-width: 1100px;
  margin: auto;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.num {
  text-align: right;
}

.danger {
  color: #dc2626;
  font-weight: bold;
}

tfoot th {
  font-weight: bold;
}

.link {
  color: #2563eb;
  font-weight: 500;
}
</style>
