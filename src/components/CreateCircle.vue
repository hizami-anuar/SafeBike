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
import MapCircle from '@/components/MapCircle.vue';
import { eventBus } from "@/main";

export default {
  name: 'CreateCircle',
  components: { MapCircle },
  props: ['circle'],
  methods: {
    dragEndHandler() {
      eventBus.$emit('create-circle-center-changed', {id: this.circle._id, center: this.center});
    },

    centerChangedHandler(event) { // event is lat/lng functions
      const center = [event.lat(), event.lng()];
      this.center = center;
    },

    radiusChangedHandler(event) { // event is radius
      eventBus.$emit('create-circle-radius-changed', {id: this.circle._id, radius: event});
    },

    circleClickHandler() {
      eventBus.$emit('create-circle-clicked', {id: this.circle._id});
    },
  }
}
</script>

<style scoped></style>