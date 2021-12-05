<template>
  <div>
    <div v-if='!this.blockages'>
      <p>Loading your posts ... </p>
    </div>
    <div v-else-if='this.blockages.length === 0'>
      <p>Sorry, no blockages to show :( </p>
    </div>
    <div v-else>
      <Blockage
        class="blockage"
        v-for='blockage in blockages'
        v-bind:key='blockage._id'
        :blockageData='blockage'
        :loggedIn='loggedIn'
        :user='user'
        @refresh-blockages="refreshBlockagesEvent"
      />
    </div>
  </div>
</template>

<script>
import Blockage from '@/components/Blockage.vue';

export default {
    name: 'Blockages',
    components: {
        Blockage
    },
    // props: ['blockages', 'loggedIn', 'user'],
    props: {
        /** @type {Blockage[]} A list of Blockage items to display */
        blockages: Array,
        loggedIn: Boolean,
        user: Object,
    },
    emits: [
        'refresh-blockages',
    ],
    methods: {
        // refresh the list of blockages
        refreshBlockagesEvent() {
        this.$emit('refresh-blockages');
        }
    }
}
</script>

<style scoped>
.blockage {
  margin-top: 20px;
}
</style>