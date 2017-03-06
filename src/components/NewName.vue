<template lang="html">
   <div>
      <form class="main-form">
         <input type="text" name="lastname" v-model="userData.lastname" placeholder="Фамилия">
         <input type="text" name="firstname" v-model="userData.firstname" placeholder="Имя">
         <input type="text" name="patronym" v-model="userData.patronym" placeholder="Отчество">
         <input type="submit" value="Добавить имя" @click.prevent="add()">
      </form>
   </div>
</template>

<script>
export default {
   data: function() {
      return {

      }
   },
   props: {
      userData: {
         type: Object,
         required: true
      }
   },
   methods: {
      add() {
         this.$emit('addEvent', this.userData);
      }
   }
}
</script>

<style lang="css">
   .main-form {
      margin-bottom: 10px;
   }
</style>
