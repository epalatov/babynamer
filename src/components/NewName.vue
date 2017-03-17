<template lang="html">
   <form class="main-form">
      <input class="main-form__item" type="text" name="lastname" v-model="userData.lastname" placeholder="Фамилия ребенка">
      <input class="main-form__item" type="text" name="firstname" v-model="userData.firstname" placeholder="Желаемое имя">
      <input class="main-form__item" type="text" name="patronym" v-model="userData.patronym" placeholder="Отчество ребенка">
      <div class="main-form__submit-wrap">
         <input class="submit-btn" type="submit" value="Добавить имя в список" @click.prevent="add()">
         <input class="submit-btn-hide" type="submit" value="Добавить имя" @click.prevent="add()">
      </div>
   </form>
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

<style lang="scss">
   .main-form {
      padding: 100px 50px 50px 50px;
      margin-bottom: 10px;
      @media (max-width: 991px) {
         padding: 60px 45px;
         margin: 0;
      }
      @media (max-width: 767px) {
         padding: 13px 0;
      }
      &__item {
         font-size: 18px;
         color: #505050;
         padding: 13px 22px;
         margin: 0 5px;
         border: none;
         border-radius: 3px;
         @media (max-width: 991px) {
            display: block;
            width: 60%;
            margin: 0 auto 12px auto;
         }
         @media (max-width: 767px) {
            width: 100%;
         }
      }
      &__submit-wrap {
         padding-top: 30px;
         @media (max-width: 767px) {
            padding: 0;
         }
      }
   }

   .submit-btn {
      border: 0;
      border-radius: 3px;
      padding: 15px 50px;
      font-size: 18px;
      color: #fff;
      background-color: darken(#D86979, 5%);
      transition: all .2s;
      outline: none;
      &:hover {
         background-color: darken(#D86979, 8%);
      }
      @media (max-width: 767px) {
         display: none;
      }
   }
   .submit-btn-hide {
      border: 0;
      border-radius: 3px;
      padding: 15px 50px;
      font-size: 22px;
      color: #fff;
      background-color: #D86979;
      transition: all .2s;
      outline: none;
      display: none;
      @media (max-width: 767px) {
         display: block;
         width: 100%;
      }
   }
</style>
