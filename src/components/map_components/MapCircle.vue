<template>
  <div id="marker-container">
    <GmapCircle
      v-if="this.circle.radius && this.circle.center.coordinates"
      :center="new this.google.maps.LatLng(this.circle.center.coordinates[0], this.circle.center.coordinates[1])"
      :radius="this.circle.radius"
      :draggable="true"
      :editable="true"
      :options="{fillColor: color}"
      @dragstart="circleClickHandler($event)"
      @dragend="dragEndHandler($event)"
      @center_changed="centerChangedHandler($event)"
      @radius_changed="radiusChangedHandler($event)"
      @click="circleClickHandler($event)"
    />
  </div>
</template>

<script>
import {gmapApi} from 'vue2-google-maps';

export default {
  name: 'Map',
  components: {  },
  props: ['circle', 'color', 'dragStartHandler', 'dragEndHandler', 'centerChangedHandler', 'radiusChangedHandler', 'circleClickHandler',],
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
}
</script>

<style scoped></style>