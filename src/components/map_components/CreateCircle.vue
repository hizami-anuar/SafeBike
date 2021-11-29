<template>
  <MapCircle
    :circle="circle"
    :color="'#AA0000'"
    :dragEndHandler="dragEndHandler"
    :centerChangedHandler="centerChangedHandler"
    :radiusChangedHandler="radiusChangedHandler"
    :circleClickHandler="circleClickHandler"
  />
</template>

<script>
import MapCircle from '@/components/map_components/MapCircle.vue';
import { eventBus } from "@/main";

export default {
  name: 'CreateCircle',
  components: { MapCircle },
  props: ['circle'],
  methods: {
    dragEndHandler() {
      this.circle.center.coordinates = this.center;
      eventBus.$emit('create-circle-center-changed', this.circle );
    },

    centerChangedHandler(event) { // event is lat/lng functions
      const center = [event.lat(), event.lng()];
      this.center = center;
    },

    radiusChangedHandler(event) { // event is radius
      this.circle.radius = event;
      eventBus.$emit('create-circle-radius-changed', this.circle );
    },

    circleClickHandler() {
      eventBus.$emit('create-circle-clicked', { _id: this.circle._id });
    },
  }
}
</script>

<style scoped></style>