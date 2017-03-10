import Vue from 'vue'
import VueFire from 'vuefire'
import App from './App.vue'

Vue.use(VueFire);
Vue.filter('to-uppercase', function(value){
   return value.toUpperCase()
});
Vue.directive('hide', {
   bind(el, binding, vnode) {
      //el.style.backgroundColor = 'green';
      //el.style.backgroundColor = binding.value;
      var delay = 0;
      if(binding.modifiers['delayed']){
         binding.value;
      }
      setTimeout(function(){
         el.style.display = "hidden";
      }, binding.value)
   }
});
Vue.mixin({

});

new Vue({
  el: '#app',
  render: h => h(App)
});
