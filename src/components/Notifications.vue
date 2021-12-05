<template>
  <div>
    <div>{{currentTime}}</div>
    <div 
      v-for="alert in alerts"
      :key="alert._id">
      {{alert.name}}: {{alert.alerts}}
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

  mounted() {
    this.timer = setInterval(() => {
      this.refreshNotifications();
    }, 1000);
  },

  beforeDestroy() {
    clearInterval(this.timer);
  },

  methods: {
    refreshNotifications() {
      this.currentTime = Date.now();
      axios.get(`/api/blockages/subscription`)
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

</style>