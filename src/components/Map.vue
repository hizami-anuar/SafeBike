<template>
  <div id="map-container">
    <GmapMap
      :center="center"
      :zoom="7"
      :options="{
        disableDoubleClickZoom: true,
      }"
      class="map"
      @dblclick="openCreateBlockageMenu"
    >
      <GmapMarker
        :key="index"
        v-for="(m, index) in displayMarkers"
        :position="m.location"
        :clickable="true"
        :draggable="true"
        @click="onMarkerClick(m.position)"
      />
    </GmapMap>
    <p>Double click on the map to create a new blockage.</p>
    <CreateBlockage 
      v-if="createBlockageMenu.active"
      :location="createBlockageMenu.location"
      @created-blockage="closeCreateBlockageMenu"
    />
  </div>
</template>

<script>
import CreateBlockage from '@/components/CreateBlockage.vue';
import { eventBus } from "../main";

export default {
  name: 'Map',
  components: { CreateBlockage },
  props: { /* blockages etc. */ },
  data: function () {
    return {
      center: {lat:10, lng:10},
      markers: [
        {location:{lat:10, lng:10}},
        {location:null},
      ],
      createBlockageMenu: {
        active: false,
        location: null,  // {lat, lng}
      },
    };
  },
  computed: {
    displayMarkers: function() {
      return [...this.markers, this.createBlockageMenu]
        .filter(x => x.location !== null);
    },
  },
  methods: {
    onMarkerClick: function(pos) {
      console.log(this.center, pos);
      this.center = pos;
    },
    openCreateBlockageMenu: function(event) {
      this.createBlockageMenu = {
        active: true,
        location: {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        }
      };
    },
    closeCreateBlockageMenu: function() {
      this.createBlockageMenu.active = false;
      eventBus.$emit('refresh-blockages');
    },
  }
}
</script>

<style scoped>
.map {
  width: 500px;
  height: 300px;
}
</style>