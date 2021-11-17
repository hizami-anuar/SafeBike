<template>
  <form>
    <div class="item">
      <p>_id: {{ blockage._id }}</p>
      <p>location: {{ blockage.location.coordinates }}</p>
      <p>time: {{ blockage.time }}</p>
      <p>reporter: {{ blockage.reporter }}</p>
      <p>description: {{ blockage.description }}</p>
      <p>status: {{ blockage.status }}</p>
      <input type="submit" v-on:click.prevent="deleteBlockage" value="Delete">
      <span>
        <label>Latitude: </label>
        <input type="number" class="small-input" v-model="editFormData.location.latitude">
        &nbsp;
        <label>Longitude: </label>
        <input type="number" class="small-input" v-model="editFormData.location.longitude">
      </span>
      <span>
        <label>Description: </label>
        <input type="text" v-model="editFormData.description">
      </span>
      <span>
        <label>Status: </label>
        <input type="text" v-model="editFormData.status">
      </span>
      <input type="submit" v-on:click.prevent="editBlockage" value="Edit Blockage">
    </div>
  </form>
</template>

<script>
import { eventBus } from "../main";

export default {
  name: 'DebugBlockageItem',
  props: ["blockage"],
  data () {
    return {
      editFormData: {
        description: undefined,
        status: undefined,
        location: {
          latitude: undefined,
          longitude: undefined,
        }
      },
    };
  },
  methods: {
    editBlockage() {
      eventBus.$emit('edit-blockage', { id: this.blockage._id, data: this.editFormData });
    },
    deleteBlockage() {
      eventBus.$emit('delete-blockage', { id: this.blockage._id });
    },
  }
}
</script>
