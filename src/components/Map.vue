<template>
  <div id="map-container">
    <GmapMap
      ref="map"
      :center="center"
      :zoom="zoom"
      :options="{
        disableDoubleClickZoom: true,
      }"
      class="map"
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
        @open-marker="id => active = id"
        @close-marker="active = null"
      />
      <GmapMarker
        v-if="createBlockageMenu.active"
        :clickable="false"
        :draggable="false"
        :position="createBlockageMenu.location"
      />
    </GmapMap>
    <p v-if='loggedIn'>Double click on the map to report a new blockage.</p>
    <p v-else>Please login in to report a new blockage</p>
    <CreateBlockage 
      v-if="createBlockageMenu.active"
      :location="createBlockageMenu.location"
      @created-blockage="closeCreateBlockageMenu"
    />
  </div>
</template>

<script>
import CreateBlockage from '@/components/CreateBlockage.vue';
import MapMarker from '@/components/MapMarker.vue';

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
        },
      };
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
.map {
  width: 500px;
  height: 300px;
  border: 5px solid rgb(182, 130, 255);
  border-radius: 3px;
}
</style>