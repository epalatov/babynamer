<template lang="html">
   <div class="">
      <ul>
         <li v-for="(chname, key, index) in chnames">{{ chname.name }}</li>
      </ul>
   </div>
</template>

<script>
export default {
   props: ['chnames']
}
</script>

<style lang="css">
</style>
