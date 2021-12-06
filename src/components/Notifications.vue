<template>
  <div>
    <div class="notification-container"
      v-for="alert in filteredAlerts"
      :key="alert._id">
      {{alert.name}}
      <div v-if="alert.alerts.BLOCKED.length">
        BLOCKED: {{alert.alerts.BLOCKED.length}}
      </div>
      <div v-if="alert.alerts.UNSAFE.length">
        UNSAFE: {{alert.alerts.UNSAFE.length}}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['alerts'],
  data() {
    return {

    }
  },

  computed: {
    filteredAlerts () {
      return this.alerts.filter((alert) => {
        return alert.alerts.UNSAFE.length || alert.alerts.BLOCKED.length;
      });
    }
  },
}
</script>

<style scoped>
.notification-container {
  border: 1px solid black;
}
</style>