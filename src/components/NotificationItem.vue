<template>
  <div class="notification-container">
    <!-- <div class='alert-name'>{{alert.name}}</div> -->
    <router-link class='link-alert' to='/subscription'><button class='alert-name'>{{alert.name}}</button></router-link>
    <div v-if="anyBlockedAlerts">
      <span class='blocked'>{{alert.alerts.BLOCKED.length}} BLOCKED</span>
    </div>
    <div v-if="anyUnsafeAlerts">
      <span class='unsafe'>{{alert.alerts.UNSAFE.length}} UNSAFE</span>
    </div>
  </div>
</template>

<script>

export default {
  props: ['alert'],
  computed: {
    anyBlockedAlerts() {
      return this.alert.alerts.BLOCKED.length > 0;
    },
    anyUnsafeAlerts() {
      return this.alert.alerts.UNSAFE.length > 0;
    },
  },
}
</script>

<style scoped>
.notification-container {
  border: 3px solid rgb(255, 251, 198);
  padding: 10px;
  padding-left: 15px;
  border-radius: 2px;
  background-color: rgb(195, 159, 254);
  text-align: left;
  margin-top: 6px;
}

.alert-name {
  font-size: 20px;
  font-weight: bold;
  padding: 2px 10px;
  width: 100%;
  background-color: rgb(195, 159, 254);
  color: rgb(122, 17, 187);
  text-align: center;
  border: 3px rgb(122, 17, 187) solid;
  border-radius: 5px;
  margin-bottom: 10px;
}

.link-alert {
  text-decoration: none;
  background-color: none;
  padding: 0px;
  text-align: center;
  margin: 0px;
}
.alert-name:hover:enabled {
  background-color: rgb(252, 242, 185);
  cursor: pointer;
}


#navbar a.router-link-exact-active {
  background-color: rgb(195, 159, 254);
  color: rgb(122, 17, 187);
}

.blocked {
  color: rgb(122, 17, 187);
  font-weight: bold;
}

.unsafe {
  color: rgb(250, 250, 78);
  font-weight: bold;
}
</style>