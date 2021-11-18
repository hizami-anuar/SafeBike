import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Debug from "../views/Debug.vue";
import Account from "../views/Account.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/debug",
    name: "Debug",
    component: Debug,
  },
  {
    path: "/account",
    name: "Account",
    component: Account,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
