<template>
  <div class="account">
    <div v-if='loggedIn'>
    <p>Welcome back, {{user.username}}!</p>
    <p>Level 0</p>
    <h3>Activity Points: {{ user.activityScore }}</h3>
    </div>
    <h2>My Reports</h2>
    <Blockages
      :blockages='blockages'
      :loggedIn='loggedIn'
      :user='user'
    />
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from "@/main";

import Blockages from '@/components/Blockages.vue';
export default {
  name: 'Account',
  components: {
    Blockages
  },
  props: {
    loggedIn: Boolean,
    user: Object
  },
  data() {
    return {
      blockages: [], // blockages made by current user
    }
  },
  mounted() {
    eventBus.$on('refresh-blockages', this.getBlockages)
    this.getBlockages();
  },
  methods: {
    getBlockages() {
      axios.get(`/api/blockages`)
        .then((response) => {
          this.blockages = response.data.blockages.filter(blockage => blockage.reporter == this.user._id);
        }).catch((error) => {
          console.log(error);
        });
    },
  },
}
</script>

<style scoped>
h2 {
  font-size: 30px;
  margin-bottom: 10px;
}
</style>