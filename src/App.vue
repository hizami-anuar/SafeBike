<template>
  <div id="app">
    Hello world!
    <button v-on:click="test">
      Test
    </button>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "App",
  methods: {
    test() {
      axios.post("/api/blockages")
        .then((response) => {
          console.log(response);
        }).catch((error) => {
          console.log(error);
        })
    }
  }
}
</script>

<style scoped>

</style>
