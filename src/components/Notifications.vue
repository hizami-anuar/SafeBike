<template>
  <div>
    <h1 class='notification-heading'>Notifications</h1>
    <NotificationItem
      v-for="alert in filteredAlerts"
      :key="alert._id"
      :alert="alert"/>
    <div v-if="!filteredAlerts.length">
      No notifications to show.
    </div>
  </div>
</template>

<script>
import NotificationItem from "@/components/NotificationItem";

export default {
  components: { NotificationItem },
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
.notification-heading {
  font-size: 30px;
  text-align: left;
}
</style>