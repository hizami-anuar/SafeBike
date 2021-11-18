<template>
  <div id="app">
    <div id="nav">
      <img class='logo' src="@/assets/navlogo.png"/>
      <h1>SafeBike</h1>
      <router-link class='link' to="/"><img class='icon' src="@/assets/home.png"/>Home</router-link>
      <router-link class='link' to="/account"><img class='icon' src="@/assets/profile.png"/>Account</router-link> 
      <router-link class='link' to="/debug">Debug</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: -26px;
}

h1 {
  margin-right: 20px;
  color: rgb(104, 27, 192);
}

#nav {
  /* padding: 30px; */
  display: flex;
  height: 70px;
  justify-content: flex-start;
  align-items: center;
  background-color: rgb(227, 214, 255);
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: rgb(255, 255, 255);
  background-color: rgb(179, 127, 250);
}

.logo {
  width: 50px;
  height: 50px;
  margin-right: 10px;
  margin-left: 20px;
}

.icon {
  width: 30px;
  height: 30px;
  margin-right: 15px;
  /* margin-left: 20px; */
}

.link {
  /* margin-right: 10px; */
  font-size: 20px;
  text-decoration: none;
  /* background-color: red; */
  padding: 20px 18px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.link:hover {
  background-color: rgb(252, 242, 185);
}


</style>
