<template>
  <div id="navbar">
    <div id='navbar-left'>
      <router-link id='logo-div' to="/"><img class='logo' src="@/assets/navlogo.png"/></router-link>
      <h1 class='logo-name'>SafeBike</h1>
      <router-link class='link' to="/"><img class='icon' src="@/assets/home.png"/>Home</router-link>
      <router-link class='link' to="/account" v-if="loggedIn"><img class='icon' src="@/assets/profile.png"/>My Reports</router-link> 
      <router-link class='link' to="/subscription" v-if="loggedIn"><img class='icon' src="@/assets/notification-bell.png"/>My Alerts</router-link> 
    </div>
    <Logout
      :loggedIn='loggedIn'
      :user='user'
      :alerts='alerts'
      :newAlerts='newAlerts'/>
  </div>
</template>


<script>
import Logout from '@/components/Logout.vue';

export default {
  name: 'NavBar',
  components: { Logout },
  props: [ 'loggedIn', 'user', 'alerts', 'newAlerts' ],
}
</script>

<style>

#navbar-left {
  display: flex;
  flex-direction: row;
  align-items: center;
}

#navbar {
  /* padding: 30px; */
  display: flex;
  height: var(--navbar-height);
  justify-content: space-between;
  align-items: center;
  background-color: rgb(227, 214, 255);
  z-index: 2;
  width: 100%;
  left: 0;
  top: 0;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#navbar a.router-link-exact-active {
  color: rgb(255, 255, 255);
  background-color: rgb(179, 127, 250);
}

#logo-div {
  background: none !important;
}

.logo {
  width: 50px;
  height: 50px;
  margin-right: 10px;
  margin-left: 20px;
}

.icon {
  width: 30px;
  height: 30px;
  margin-right: 15px;
  /* margin-left: 20px; */
}

.link {
  /* margin-right: 10px; */
  font-size: 20px;
  text-decoration: none;
  /* background-color: red; */
  padding: 20px 18px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.link:hover {
  background-color: rgb(252, 242, 185);
}

.logo-name {
  margin-right: 20px;
  color: rgb(104, 27, 192);
}
</style>
