<template>
  <div id="map-container">
    <div class="map-left">
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
      class="map"
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
    <div class='instructions'>
    <p>Click on an existing pin to view details on the blockage report</p>
    <p v-if='loggedIn'>Double click on the map to report a new blockage.</p>
    <p v-else>Please log in to report a new blockage</p>
    </div>
    </div>
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
import MapMarker from '@/components/MapMarker.vue';
import { eventBus } from "../main";

export default {
  name: 'Map',
  components: { CreateBlockage, MapMarker },
  props: {
      /** @type {Blockage[]} The blockage object to display */
      blockages: Array,
      loggedIn: Boolean,
      user: Object,
      // 'center' likely
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
    onMarkerClick: function(pos) {
      console.log(this.center, pos);
      this.center = pos;
    },
    closeAllMarkerPopups: function() {
      this.active = null;
    },
    openCreateBlockageMenu: function(event) {
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

.instructions {
  position: fixed;
  top: 80px;
  left: 35%;
  padding: 6px 12px;
  z-index: 99999;
  background-color: white;
}
.create-blockage {
  z-index: 1;
  position: fixed;
  margin-left: 20px;
  top: 15%;
}
#map-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.map {
  width: 100vw;
  height: 100vh;
  margin-top: 0px;
  /* border: 5px solid rgb(182, 130, 255); */
  border-radius: 3px;
  right: 0%;
  left: 0%;
}
</style>