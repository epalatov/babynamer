<template lang="html">
   <div>
      <span>Favorites</span>
      <button type="button" name="clearList" @click="clearFavorite()">Clear Favorite</button>
      <button type="button" name="removeFavorite" @click="removeFavorite(selectedNames)">Remove</button>
      <hr>
      <div class="empty-list" v-show="favoriteListEmpty">Ваш список избранного пуст</div>
      <ul>
         <li class="list__item" v-for="(name, index) in names"
                        v-if="name.favorite === true"
                        :key="name" @click="select(name.firstname)">
                        {{ customFilter(name.curMode) }}
         </li>
      </ul>
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
