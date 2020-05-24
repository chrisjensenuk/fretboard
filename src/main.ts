import Vue from 'vue'
import App from './App.vue'
import store from "@/common/store";

Vue.config.productionTip = false


Vue.filter('noteFilter', function(note : string){
  return note.replace(/[1-5]/g, '');
})

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
