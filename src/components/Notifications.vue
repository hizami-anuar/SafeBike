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
import axios from "axios";
export default {
  data() {
    return {
      alerts: [],
      timer: undefined,
      currentTime: undefined,
    }
  },

  computed: {
    filteredAlerts () {
      return this.alerts.filter((alert) => {
        return alert.alerts.UNSAFE || alert.alerts.BLOCKED;
      });
    }
  },

  mounted() {
    this.refreshNotifications();
    this.timer = setInterval(() => {
      this.refreshNotifications();
    }, 30000);
  },

  beforeDestroy() {
    clearInterval(this.timer);
  },

  methods: {
    refreshNotifications() {
      axios.get(`/api/blockages/subscription?active=true`)
        .then((response) => {
          console.log(response);
          this.alerts = response.data.alerts;
        }).catch((error) => {
          console.log(error);
        })
    },
  }
}
</script>

<style scoped>
.notification-container {
  border: 1px solid black;
}
</style>