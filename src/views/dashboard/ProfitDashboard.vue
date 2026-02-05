<script setup>
import { ref, onMounted, watch } from "vue";
import http from "@/api/http";
import ProfitCard from "@/components/ProfitCard.vue";
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
);

const range = ref("week");
const loading = ref(false);
const error = ref("");

const profitData = ref({ sales: 0, cost: 0, profit: 0 });
const lastWeek = ref({ sales: 0, cost: 0, profit: 0 });

const fromDate = ref("");
const toDate = ref("");

let chartInstance = null;

/* ---------- HELPERS ---------- */
const percentChange = (current, previous) => {
  if (!previous) return 0;
  return (((current - previous) / previous) * 100).toFixed(2);
};

/* ---------- FETCH ---------- */
const fetchProfit = async () => {
  try {
    loading.value = true;

    let url = `/profit?range=${range.value}`;
    if (fromDate.value && toDate.value) {
      url = `/profit?from=${fromDate.value}&to=${toDate.value}`;
    }

    const res = await http.get(url, {
      headers: { "Cache-Control": "no-cache" },
    });

    profitData.value = res.data;

    // Week comparison
    if (range.value === "week") {
      const lw = await http.get("/profit?range=last_week");
      lastWeek.value = lw.data;
    }

    drawChart();
  } catch (err) {
    console.error(err);
    error.value = "Failed to load data";
  } finally {
    loading.value = false;
  }
};

/* ---------- CHART ---------- */
const drawChart = () => {
  const ctx = document.getElementById("profitChart");
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Sales", "Cost", "Profit"],
      datasets: [
        {
          label: "This Period",
          data: [
            profitData.value.sales,
            profitData.value.cost,
            profitData.value.profit,
          ],
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
    },
  });
};

watch([range, fromDate, toDate], fetchProfit);
onMounted(fetchProfit);
</script>

<template>
  <div class="profit-dashboard">
    <h2>📊 Profit Dashboard</h2>

    <!-- 🔁 RANGE SWITCHER -->
    <div class="switcher">
      <button
        v-for="r in ['today', 'week', 'month', 'year']"
        :key="r"
        :class="{ active: range === r }"
        @click="
          range = r;
          fromDate = '';
          toDate = '';
        "
      >
        {{ r.toUpperCase() }}
      </button>
    </div>

    <!-- 📅 CUSTOM DATE PICKER -->
    <div class="date-picker">
      <input type="date" v-model="fromDate" />
      <input type="date" v-model="toDate" />
    </div>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <!-- 💰 CARD -->
    <ProfitCard :title="range.toUpperCase()" :data="profitData" />

    <!-- 🔄 WEEK COMPARISON -->
    <div v-if="range === 'week'" class="compare-box">
      <h3>📊 Week vs Last Week</h3>

      <p>
        Sales:
        <span
          :class="
            percentChange(profitData.sales, lastWeek.sales) >= 0 ? 'up' : 'down'
          "
        >
          {{ percentChange(profitData.sales, lastWeek.sales) }}%
        </span>
      </p>

      <p>
        Profit:
        <span
          :class="
            percentChange(profitData.profit, lastWeek.profit) >= 0
              ? 'up'
              : 'down'
          "
        >
          {{ percentChange(profitData.profit, lastWeek.profit) }}%
        </span>
      </p>
    </div>

    <!-- 📈 CHART -->
    <div class="chart-box">
      <canvas id="profitChart"></canvas>
    </div>
  </div>
</template>

<style scoped>
.switcher {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.switcher button {
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: #8a95a1;
}

.switcher button.active {
  background: #2563eb;
  color: #fff;
}

.date-picker {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.compare-box {
  background: #f8fafc;
  padding: 14px;
  border-radius: 8px;
  margin: 20px 0;
}

.up {
  color: #059669;
  font-weight: 600;
}

.down {
  color: #dc2626;
  font-weight: 600;
}

.chart-box {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
}
</style>
