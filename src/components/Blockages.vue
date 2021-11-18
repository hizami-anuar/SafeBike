<template>
  <div>
    <div v-if='this.blockages.length === 0'>
      <p>Sorry, no blocakges to show :( </p>
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
    /** @type {Blockage[]} A list of freet ids to display */
    blockages: Array,
  },
  data() {
    return {
    }
  },
    emits: [
        'refresh-blockages',
    ],
  computed: {
  },
  mounted() {
    console.log(this.blockages);
  },
  methods: {
    /**
     * Makes an API call to get the data for all of the freets in the list Freets 
     */
    // refreshBlockageData() {
    //   // Remove Stale / Deleted Freets
    // //   this.blockageData = this.blockageData.filter(d => d && this.freets.includes(d.id));
    // //   // Get updated information on given freets
    // //   this.blockageData.forEach((id, index) => {
    // //     axios.get(`/api/freets/id/${id}`).then((res) => {
    // //       this.freetData[index] = res.data;
    // //     }).catch((err) => {
    // //       console.log(err);
    // //     });
    // //   });
    //     axios.get(`/api/blockages`)
    //     .then((response) => {
    //       this.blockageData = response.data.blockages;
    //     }).catch((error) => {
    //       this.console.log(error);
    //     });
    // },

    refreshBlockagesEvent() {
      this.$emit('refresh-blockages');
    }
  }


}
</script>