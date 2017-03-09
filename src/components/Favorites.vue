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
                        {{ name.curMode }}
         </li>
      </ul>
   </div>
</template>

<script>
export default {
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
      }
   }
}
</script>

<style lang="scss">
</style>
