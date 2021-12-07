<template>
  <div>
    <h1 class='notification-heading'>Notifications</h1>
    <h2 class='notification-subheading'>New alerts</h2>
    <NotificationItem
      v-for="alert in filteredAlerts"
      :key="alert._id"
      :alert="alert"/>
    <div v-if="filteredAlerts === undefined">
      Loading...
    </div>
    <div v-else-if="!filteredAlerts.length">
      No notifications to show.
    </div>
    <h2 class='notification-subheading'>Active subscriptions</h2>
    <NotificationSummaryItem
      v-for="alert in filteredSummaryAlerts"
      :key="alert._id"
      :alert="alert"/>
  </div>
</template>

<script>
import NotificationItem from "@/components/NotificationItem";
import NotificationSummaryItem from "@/components/NotificationSummaryItem";

export default {
  components: { NotificationItem, NotificationSummaryItem },
  props: ['alerts'], // { blockageAlerts, summaryAlerts }
  data() {
    return {

    }
  },

  computed: {
    filteredAlerts () {
      return this.alerts.blockageAlerts;
    },
    filteredSummaryAlerts () {
      return this.alerts.summaryAlerts.filter((alert) => {
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

.notification-subheading {
  font-size: 20px;
  margin: 10px 0;
  text-align: left;
  margin-bottom: -5px;
}
</style>