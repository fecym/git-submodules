import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../modules/HomeView.vue";
import modules from "./requireModules";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  ...modules,
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
