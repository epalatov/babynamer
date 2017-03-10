import Vue from 'vue'
import VueFire from 'vuefire'
import App from './App.vue'

Vue.use(VueFire);
Vue.filter('to-uppercase', function(value){
   return value.toUpperCase()
});
Vue.directive('highlight', {
   bind(el, binding, vnode) {
      //el.style.backgroundColor = 'green';
      //el.style.backgroundColor = binding.value;
      var delay = 0;
      if(binding.modifiers['delayed']){
         delay = 3000;
      }
      setTimeout(function(){
         if(binding.arg == 'background'){
            el.style.backgroundColor = binding.value;
         } else {
            el.style.color = binding.value;
         }
      }, delay)
   }
});
Vue.mixin({
   
});

new Vue({
  el: '#app',
  render: h => h(App)
});
