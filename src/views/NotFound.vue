<template>
  <main>
    <h1>Page Not Found</h1>
    <p>
      Click <router-link to="/">here</router-link> to return to the home screen.
    </p>
  </main>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>

h1{
    color: black;
    font-size: 64px;
}
a {
    color: purple;
    text-decoration: none;
    padding: 0.5em;
}

</style>