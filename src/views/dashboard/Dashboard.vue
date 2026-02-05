<template>
  <div>
    <h1>Dashboard</h1>

    <!-- KPI CARDS -->
    <div class="grid">
      <DashboardCard title="Total Sales" :value="data.totalSales" />
      <DashboardCard title="Total Purchase" :value="data.totalPurchase" />
      <DashboardCard title="Payments Received" :value="data.totalPayments" />
      <DashboardCard title="Products" :value="data.totalProducts" />
    </div>

    <!-- CHART -->
    <div class="card">
      <h3>Monthly Sales vs Purchase</h3>
      <canvas ref="chart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import http from "@/api/http";
import DashboardCard from "@/components/DashboardCard.vue";
import Chart from "chart.js/auto";

const chart = ref(null);
let chartInstance = null;

const data = ref({
  totalSales: 0,
  totalPurchase: 0,
  totalPayments: 0,
  totalProducts: 0,
  monthlySales: [],
  monthlyPurchase: [],
});

const loadDashboard = async () => {
  const res = await http.get("/dashboard/summary", {
    headers: { "Cache-Control": "no-cache" },
  });

  data.value = res.data;

  renderChart();
};

const renderChart = () => {
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(chart.value, {
    type: "bar",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Sales",
          data: data.value.monthlySales,
        },
        {
          label: "Purchase",
          data: data.value.monthlyPurchase,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
};

onMounted(loadDashboard);
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  height: 350px;
}
</style>
