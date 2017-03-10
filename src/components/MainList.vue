<template lang="html">
   <div>
      <span>Main list</span>
      <button type="button" name="clearList" @click="takeAction(selectedNames, 'clearList')">Clear List</button>
      <button type="button" name="ToFavorite" @click="takeAction(selectedNames, 'toFavorite')">To Favorite</button>
      <button type="button" name="removeName" @click="takeAction(selectedNames, 'removeName')">Remove</button>
      <button type="button" name="changeMode" @click="modeList()">List Mode</button>
      <hr>
      <div class="empty-list" v-show="mainListEmpty">Список пуст</div>
      <ul>
         <li class="list__item" v-for="(name, index) in names"
                                 v-if="name.favorite === false"
                                 :key="name" @click="select(name.firstname)">
                                 {{ customFilter(name.curMode) }}
                                 <span class="change-mode-btn" @click="mode(name)"><i class="fa fa-random" aria-hidden="true"></i></span>
         </li>
      </ul>
   </div>
</template>

<script>
import { myMixin } from '../myMixin';
export default {
   data: function() {
      return {
      }
   },
   mixins:[myMixin],
   props: {
      names: Array,
      selectedNames: Array,
      takeAction: Function,
      modeList: Function,
      mainListEmpty: Boolean
   },
   methods: {
      select(name) {
         this.$emit('selected', name)
      },
      mode(name) {
         this.$emit('mode', name)
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
   },
   filters: {
      toLowercase(value) {
         return value.toLowerCase();
      }
   },
   computed: {

   }
}
</script>

<style lang="scss">
   .change-mode-btn:before {
      margin-left: 10px;
      font-size: 12px;
      content: '\f074';
      font-family: 'FontAwesome';
      cursor: pointer;
   }
   .list__item {
      padding: 5px 0;
   }
</style>
