<template>
  <div class="notification-container">
    <div v-if="anyBlockedAlerts">
      BLOCKED: {{alert.alerts.BLOCKED.length}}
    </div>
    <div v-if="anyUnsafeAlerts">
      UNSAFE: {{alert.alerts.UNSAFE.length}}
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
  border: 1px solid black;
}
</style>