<template>
  <div id="map-container">
    <GmapMap
      ref="map"
      :center="center"
      :zoom="zoom"
      :options="{
        disableDoubleClickZoom: true,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        clickableIcons: false,
      }"
      id="map"
      @click="closeAllMarkerPopups"
      @dblclick="openCreateBlockageMenu"
    >
      <MapMarker
        v-for="([b, m], index) in displayMarkers"
        :key="index"
        :loggedIn="loggedIn"
        :user="user"
        :map="$refs.map"
        :blockage="b"
        :marker="m"
        :active="active === b._id"
        @open-marker="clickBlockageMarker"
        @close-marker="active = null"
      />
      <GmapMarker
        v-if="createBlockageMenu.active"
        :clickable="false"
        :draggable="false"
        :position="createBlockageMenu.location"
      />
    </GmapMap>
    <CreateBlockage 
      class='create-blockage'
      v-if="createBlockageMenu.active"
      :location="createBlockageMenu.location"
      @created-blockage="closeCreateBlockageMenu"
    />
  </div>
</template>

<script>
import CreateBlockage from '@/components/CreateBlockage.vue';
import MapMarker from '@/components/map_components/MapMarker.vue';
import { eventBus } from "@/main";

export default {
  name: 'Map',
  components: { CreateBlockage, MapMarker },
  props: {
      /** @type {Blockage[]} The blockage object to display */
      blockages: Array,
      loggedIn: Boolean,
      user: Object,
      circles: Array,
      // 'center' likely
  },
  mounted() {
    eventBus.$on('close-marker', () => this.active = null);
  },
  data: function () {
    return {
      center: {lat:42.3601, lng:-71.0942},  // where the map starts
      zoom: 13,
      active: null,  // which marker is active
      createBlockageMenu: {
        active: false,
        location: null,  // {lat, lng}
      },
    };
  },
  computed: {
    displayMarkers: function() {  // [(blockage, marker)]
      let markers = this.blockages.map(b => {
        const [lat, lng] = b.location.coordinates;
        return [b, {location: {lat, lng}}];
      });
      return markers;
    },
  },
  methods: {
    clickBlockageMarker (id) {
      this.active = id;
      this.closeCreateBlockageMenu();
    },
    closeAllMarkerPopups: function() {
      this.active = null;
      eventBus.$emit('close-marker');
    },
    openCreateBlockageMenu: function(event) {
      if (!this.loggedIn) return;
      this.createBlockageMenu = {
        active: true,
        location: {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        },
      };
      eventBus.$emit('close-marker');
    },
    closeCreateBlockageMenu: function() {
      this.createBlockageMenu = {
        active: false,
        location: null,
      };
    },
  }
}
</script>

<style scoped>
.create-blockage {
  z-index: 1;
  position: fixed;
  margin-left: 20px;
  top: 15%;
}
#map-container {
  position: relative;
  width: 100%;
  height: 100%;
}
#map {
  width: 100%;
  height: 100%;
}
</style>