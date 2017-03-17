<template lang="html">
   <div class="row result">
      <div class="control-btns">
         <button type="button" name="clearList" @click="takeAction(selectedNames, 'clearList')">Очистить список</button>
         <button type="button" name="ToFavorite" @click="takeAction(selectedNames, 'toFavorite')">Добавить в избранное</button>
         <button type="button" name="removeName" @click="takeAction(selectedNames, 'removeName')">Удалить выбранное</button>
         <button type="button" name="changeMode" @click="modeList()">Режим списка</button>
      </div>

      <div id="list-box" class="list-box col-md-8 col-lg-8 col-md-offset-2 col-lg-offset-2">
         <div class="empty-list" v-show="mainListEmpty">Список пуст</div>
         <ul class="list">
            <!-- <transition-group name="slide-fade"> -->
               <li class="list-box__item" v-for="(name, index) in names"
                                       v-if="name.favorite === false"
                                       :key="name" @click="select(name.firstname)"
                                       :class="{selectedName : name.selected}"
                                       >
                                       {{ customFilter(name.curMode) }}
                                       <!-- <span class="change-mode-btn" @click="mode(name)"></span> -->
               </li>
            <!-- </transition-group> -->
         </ul>
      </div>
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
   .selectedName:before {
      color: #D86979;
   }
   .result {
      padding: 40px 24px 40px 24px;
      @media(max-width: 767px){
         padding-top: 15px;
      }
   }
   .change-mode-btn:before {
      color: #e3e3e3;
      margin-left: 10px;
      font-size: 18px;
      content: '\f074';
      font-family: 'FontAwesome';
      cursor: pointer;
   }
   .change-mode-btn:hover:before {
      color: #cdcdcd;
   }
</style>
