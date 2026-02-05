<template>
  <div class="app">
    <aside class="sidebar">
      <h3>Billing ERP</h3>

      <nav>
        <!-- DASHBOARD -->
        <router-link to="/" class="nav-item" exact-active-class="active">
          Dashboard
        </router-link>

        <!-- MASTER -->
        <router-link
          to="/products"
          class="nav-item"
          exact-active-class="active"
        >
          Products
        </router-link>

        <router-link
          to="/suppliers"
          class="nav-item"
          exact-active-class="active"
        >
          Suppliers
        </router-link>

        <router-link to="/vendors" class="nav-item" exact-active-class="active">
          Customers
        </router-link>

        <!-- PURCHASE -->
        <div class="menu">
          <div class="menu-title">Purchase</div>

          <router-link
            to="/purchase/create"
            class="nav-sub"
            exact-active-class="active"
          >
            + New Purchase
          </router-link>

          <router-link
            to="/purchase"
            class="nav-sub"
            exact-active-class="active"
          >
            Purchase List
          </router-link>
        </div>

        <!-- SALES -->
        <div class="menu">
          <div class="menu-title">Sales</div>

          <router-link to="/sales" class="nav-sub" exact-active-class="active">
            Sales Invoice
          </router-link>
        </div>

        <!-- REPORTS -->
        <div class="menu">
          <div class="menu-title">Reports</div>

          <!-- <router-link
            to="/reports/supplier-outstanding"
            class="nav-sub"
            exact-active-class="active"
          >
            Supplier Outstanding
          </router-link> -->

          <router-link
            to="/reports/outstanding"
            class="nav-sub"
            exact-active-class="active"
          >
            Outstanding
          </router-link>

          <router-link
            to="/reports/ageing"
            class="nav-sub"
            exact-active-class="active"
          >
            Ageing Report
          </router-link>
          <router-link to="/reports/profit" class="nav-item">
            Profit & Loss
          </router-link>
        </div>
      </nav>

      <button class="logout" @click="logout">Logout</button>
    </aside>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/authStore";
const auth = useAuthStore();
const logout = () => auth.logout();
</script>

<style scoped>
.app {
  display: flex;
  min-height: 100vh;
}

/* SIDEBAR */
.sidebar {
  width: 230px;
  background: #1e3a8a;
  color: white;
  padding: 20px;
}

.sidebar h3 {
  margin-bottom: 25px;
  font-size: 18px;
}

/* LINKS */
.nav-item,
.nav-sub {
  display: block;
  padding: 10px;
  border-radius: 6px;
  color: white;
  margin-bottom: 6px;
  text-decoration: none;
}

.nav-sub {
  font-size: 14px;
  margin-left: 10px;
  padding: 8px 12px;
}

/* ACTIVE */
.active {
  background: #2563eb;
}

/* MENU GROUP */
.menu {
  margin-top: 15px;
}

.menu-title {
  font-size: 12px;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 6px;
}

/* LOGOUT */
.logout {
  margin-top: 25px;
  width: 100%;
  padding: 10px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

/* CONTENT */
.content {
  flex: 1;
  padding: 20px;
  background: #f4f6fa;
}

/* MOBILE */
@media (max-width: 768px) {
  .sidebar {
    width: 70px;
    padding: 10px;
  }

  .sidebar h3,
  .menu-title {
    display: none;
  }

  .nav-item,
  .nav-sub {
    font-size: 12px;
    margin-left: 0;
  }
}
</style>
