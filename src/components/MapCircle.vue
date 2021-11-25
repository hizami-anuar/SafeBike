<template>
  <div id="marker-container">
    <GmapCircle
      :center="new this.google.maps.LatLng(this.circle.center.coordinates[0], this.circle.center.coordinates[1])"
      :radius="this.circle.radius"
      :draggable="true"
      :editable="true"
      :options="{fillColor: '#AAAA00'}"
      @dragend="dragEndHandler($event)"
      @center_changed="centerChangedHandler($event)"
      @radius_changed="radiusChangedHandler($event)"
      @click="circleClickHandler($event)"
    />
  </div>
</template>

<script>
import {gmapApi} from 'vue2-google-maps';
import { eventBus } from '@/main';

export default {
  name: 'Map',
  components: {  },
  props: ['loggedIn', 'user', 'map', 'circle'],
  data: function () {
    return {
      marker: undefined,
      region: undefined,
      center: undefined,
    };
  },
  computed: {
    google: gmapApi,
  },
  async mounted() {
    await this.$gmapApiPromiseLazy();
    await this.$nextTick();
  },
  methods: {
    dragEndHandler() {
      eventBus.$emit('circle-center-changed', {id: this.circle._id, center: this.center});
    },

    centerChangedHandler(event) { // event is lat/lng functions
      const center = [event.lat(), event.lng()];
      this.center = center;
    },

    radiusChangedHandler(event) { // event is radius
      eventBus.$emit('circle-radius-changed', {id: this.circle._id, radius: event});
    },

    circleClickHandler() {
      console.log('clicked');
      eventBus.$emit('circle-clicked', {id: this.circle._id});
    },
  },
}
</script>

<style scoped></style>