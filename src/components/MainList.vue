<template lang="html">
   <div>
      <span>Main list</span>
      <button type="button" name="clearList" @click="takeAction(selectedNames, 'clearList')">Clear List</button>
      <button type="button" name="ToFavorite" @click="takeAction(selectedNames, 'toFavorite')">To Favorite</button>
      <button type="button" name="removeName" @click="takeAction(selectedNames, 'removeName')">Remove</button>
      <hr>
      <ul>
         <li class="list__item" v-for="(name, index) in names" v-if="name.favorite === false" :key="name" @click="select(name.firstname)">{{ name.lastname }} {{ name.firstname }} {{ name.patronym }}<span>ch</span></li>
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
      takeAction: Function
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
