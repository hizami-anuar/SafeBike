import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps'
 
Vue.use(VueGoogleMaps, {
  load: {
    //key: 'AIzaSyAfaY0wp5E27nFpF4B2FMNWrrvbKpJXsJo',
    key: 'AIzaSyCqv_UuwiTl4nLPH4DxLRjsX1isAWJkcKQ',
    libraries: 'places,drawing,visualization'
    // (as you require)
    //// If you want to set the version, you can do so:
    // v: '3.26',
  },
 
  //// If you intend to programmatically custom event listener code
  //// (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  //// instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
  //// you might need to turn this on.
  // autobindAllEvents: false,
 
  //// If you want to manually install components, e.g.
  //// import {GmapMarker} from 'vue2-google-maps/src/components/marker'
  //// Vue.component('GmapMarker', GmapMarker)
  //// then disable the following:
  // installComponents: true,
})

import App from './App.vue';
import router from './router'

export const eventBus = new Vue();

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
