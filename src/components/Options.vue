<template lang="html">
   <div>
      <label><input type="radio" name="gender" value="male" v-model="gender">boy</label>
      <label><input type="radio" name="gender" value="female" v-model="gender">girl</label>
      <datepicker class="datepicker"
                  v-model="value"
                  :placeholder="placeholder"
                  :language="language"
                  :monday-first="mondayFirst"
                  >
      </datepicker>
      <button type="button" @click="getChurchNames(gender, churchDate)">Show</button>
  </div>
</template>
<script>
import Datepicker from 'vuejs-datepicker';
export default {
   components: {
      datepicker: Datepicker
   },
   props: {
      getChurchNames: Function
   },
   data() {
      return {
         state: {
            date: new Date()
         },
         value: '',
         gender: '',
         mondayFirst: true,
         language: 'ru',
         placeholder: 'Выберите ПДР',
         options: {
            month: '2-digit',
            day: '2-digit'
         }
      }
   },
   computed: {
      churchDate() {
         var string =  this.value.toLocaleString("ru", this.options)
         return string
      }
   }
}


</script>

<style lang="css">
   .datepicker {
      display: inline-block;
   }
</style>
