<template>
  <div>
    <div class="notification-container"
      v-for="alert in filteredAlerts"
      :key="alert._id">
      {{alert.name}}
      <div v-if="alert.alerts.BLOCKED">
        BLOCKED: {{alert.alerts.BLOCKED}}
      </div>
      <div v-if="alert.alerts.UNSAFE">
        UNSAFE: {{alert.alerts.UNSAFE}}
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
        return alert.alerts.UNSAFE || alert.alerts.BLOCKED;
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