<template>
  <div class="notification-container">
    <div v-if="anyBlockedAlerts">
      <span class='blocked'>BLOCKED: {{alert.alerts.BLOCKED.length}}</span>
    </div>
    <div v-if="anyUnsafeAlerts">
      <span class='unsafe'>UNSAFE: {{alert.alerts.UNSAFE.length}}</span>
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
  padding: 5px;
  border-radius: 2px;
  background-color: rgb(195, 159, 254);
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