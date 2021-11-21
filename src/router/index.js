import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Debug from "../views/Debug.vue";
import Account from "../views/Account.vue";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import Settings from "../views/Settings.vue";
import Subscription from "../views/Subscription.vue";

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
  {
    path: "/subscription",
    name: "Subscription",
    component: Subscription,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
