<template>
  <div>
    <div v-if='this.blockages.length === 0'>
      <p>Sorry, no blockages to show :( </p>
    </div>
    <div v-else>
      <Blockage
        v-for='blockage in blockages'
        v-bind:key='blockage._id'
        v-bind:blockageData='blockage'
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
    props: {
        /** @type {Blockage[]} A list of Blockage items to display */
        blockages: Array,
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