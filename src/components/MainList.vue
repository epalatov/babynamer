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
                                 {{ name.curMode }}
                                 <span class="change-mode-btn" @click="mode(name)">ch</span>
         </li>
      </ul>
   </div>
</template>

<script>
export default {
   data: function() {
      return {

      }
   },
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
      }
   }
}
</script>

<style lang="scss">
.change-mode-btn {
   cursor: pointer;
}
</style>
