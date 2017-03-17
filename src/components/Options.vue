<template lang="html">
   <div class="container">
      <div class="row options-panel">
         <label><input class="radio-btn" type="radio" name="gender" value="male" v-model="gender">Мальчик</label>
         <label><input class="radio-btn" type="radio" name="gender" value="female" v-model="gender">Девочка</label>
         <datepicker
                     v-model="value"
                     :placeholder="placeholder"
                     :language="language"
                     :monday-first="mondayFirst"
                     :wrapper-class="datepickerWrap"
                     :format="format"
                     >
         </datepicker>
         <button class="show-chnames" type="button" @click="getChurchNames(gender, churchDate)"><a href="#list-box">Показать</a></button>
         <button class="close-options" type="button" @click="closeOptions()">Закрыть</button>
      </div>
  </div>
</template>
<script>
import Datepicker from 'vuejs-datepicker';
export default {
   components: {
      datepicker: Datepicker
   },
   props: {
      getChurchNames: Function,
      closeOptions: Function
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
         },
         datepickerWrap: 'datepicker-wrap',
         format: 'dd MMM'
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

<style lang="scss">
   .options-panel {
      text-align: center;
      .radio-btn {
         margin-right: 5px;
      }
      label {
         font-weight: normal;
         margin-left: 5px;
         font-size: 16px;
         color: #fff;
         cursor: pointer;
      }
   }
   .datepicker-wrap {
      display: inline-block;
      input {
         color: #353b3e;
         font-size: 16px;
         padding: 6px 10px;
         margin-left: 20px;
         border-radius: 3px;
         border: none;
         @media (max-width: 767px) {
            margin-top: 17px;
            margin-left: 0;
         }
      }
   }
   .show-chnames {
      font-size: 16px;
      background-color: #D86979;
      outline: none;
      border: none;
      border-radius: 3px;
      color: #fff;
      padding: 7px 20px;
      margin-left: 10px;
      transition: all .2s;
      &:hover {
         background-color: darken(#D86979, 5%);
      }
      &>a {
         color: #fff;
         text-decoration: none;
      }
      @media (max-width: 767px) {
         margin-top: 10px;
         margin-left: 0;
      }
   }
   .close-options {
      display: block;
      margin: 10px auto 0 auto;
      background: none;
      border: none;
      color: #e67c8b;
      display: none;
      @media(max-width: 767px){
         display: block;
      }
   }
</style>
