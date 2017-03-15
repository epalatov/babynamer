<template lang="html">
   <div class="row result">
      <div class="control-btns">
         <button type="button" name="clearList" @click="clearFavorite()">Очистить список избранного</button>
         <button type="button" name="removeFavorite" @click="removeFavorite(selectedNames)">Удалить выбранное</button>
      </div>

      <div class="list-box col-md-8 col-lg-8 col-md-offset-2 col-lg-offset-2">
         <div class="empty-list" v-show="favoriteListEmpty">Ваш список избранного пуст</div>
         <ul class="list">
            <!-- <transition-group name="slide-fade"> -->
               <li class="list-box__item" v-for="(name, index) in names"
                              v-if="name.favorite === true"
                              :key="name" @click="select(name.firstname)"
                              :class="{selectedName : name.selected}"
                              >
                              {{ customFilter(name.curMode) }}
               </li>
            <!-- </transition-group"> -->
         </ul>
      </div>
   </div>
</template>

<script>
import { myMixin } from  '../myMixin';
export default {
   mixins:[myMixin],
   props: {
      names: Array,
      selectedNames: Array,
      clearFavorite: Function,
      removeFavorite: Function,
      takeAction: Function,
      favoriteListEmpty: Boolean
   },
   methods: {
      select(name) {
         this.names.forEach(function(item, index, arr){
            if(item.firstname == name){
               if(item.selected == true) {
                  item.selected = false;
               } else {
                  item.selected = true;
               }
            }
         })
         this.$emit('selected', name)
      },
      customFilter(name) {
         var result = []
         var arrItems = name.split(' ')
         for (var i = 0; i < arrItems.length; i++) {
            var firstChar = arrItems[i].charAt(0).toUpperCase();
            var item = arrItems[i].toLowerCase().slice(1)
            result.push(firstChar+item)
         }
         return result.join(' ');
      }
   }
}
</script>

<style lang="scss">

</style>
