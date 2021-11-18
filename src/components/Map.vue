<template>
  <div id="map-container">
    <GmapMap
      :center="center"
      :zoom="7"
      class="map"
    >
      <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        @click="onMarkerClick(m.position)"
      />
    </GmapMap>
    <p>Double click on the map to create a new blockage.</p>
    <CreateBlockage />
  </div>
</template>

<script>
import CreateBlockage from '@/components/CreateBlockage.vue';

export default {
  name: 'Map',
  components: { CreateBlockage },
  data: function () {
    return {
      center: {lat:10, lng:10},
      markers: [
        {position:{lat:10, lng:10}}
      ],
    };
  },
  methods: {
    onMarkerClick: function(pos) {
      console.log(this.center);
      this.center = pos;
    }
  }
}
</script>

<style scoped>
.map {
  width: 500px;
  height: 300px;
}
</style>