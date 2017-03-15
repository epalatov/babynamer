<template lang="html">
   <div>
      <iframe frameborder="0" allowtransparency="true" scrolling="no" src="https://money.yandex.ru/embed/donate.xml?account=41001554340569&quickpay=donate&payment-type-choice=on&mobile-payment-type-choice=on&default-sum=50&targets=%D0%9F%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%B8%D1%82%D0%B5+%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82!&target-visibility=on&project-name=Babynamer&project-site=babynamer.ru&button-text=01&successURL=" width="522" height="117"></iframe>
      <button type="button" @click="changeDonateShow()" class="donate-btn" >Как-нибудь в другой раз</button>
   </div>
</template>

<script>
export default {
   props: {
      changeDonateShow: Function
   }
}
</script>

<style lang="scss">
   .donate {
      margin-top: 30px;
      padding: 10px 0;
      text-align: center;
   }
   .donate-btn {
      height: 15px;
      outline: none;
      line-height: 15px;
      margin: 5px auto;
      display: block;
      border: 0;
      background: none;
      padding: 0;
      color: #b1b1b1;
      &:hover {
         border-bottom: 1px solid #b1b1b1;
      }
   }
</style>
