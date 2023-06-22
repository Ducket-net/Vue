// src/router/index.js
import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../components/HomeView.vue";
import GameRoom from "../components/GameRoom.vue";
import CatalogPage from "../components/pages/CatalogPage.vue";
import Login from "@/components/pages/LoginPage.vue";
import AuthCallback from "@/components/pages/AuthCallback.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView, // Set the home component for the root URL
  },
  {
    path: "/catalog",
    name: "Catalog",
    component: CatalogPage, // Set the home component for the root URL
  },
  {
    path: "/room/:id", // Add the dynamic :id parameter
    name: "GameRoom",
    component: GameRoom,
  },
  { path: "/login", component: Login },
  { path: "/auth/callback", component: AuthCallback },
  {
    path: "/*",
    component: HomeView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
