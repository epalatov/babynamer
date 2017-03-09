<template lang="html">
   <div class="footer">
      <div class="print">
         <span class="print-button" onclick="window.print()"><i class="fa fa-print print-button__icon" aria-hidden="true"></i>Распечатать список</span>
      </div>
      <div class="share-button">
         <div class="ya-share2" data-services="vkontakte,facebook,odnoklassniki"></div>
      </div>
      <button type="button" @click="changeCurrentView()">О проекте</button>
      <button type="button" @click="changeDonateShow()">Donate</button>
   </div>
</template>

<script>
export default {
   props: {
      changeDonateShow: Function,
      changeCurrentView: Function
   }
}
</script>

<style lang="scss">
   .footer {
      padding: 20px 0;
      text-align: center;
   }
   .print {
      .print-button {
         background-color: #fbce48;
         display: inline-block;
         cursor: pointer;
         padding: 10px 20px;
         margin-bottom: 20px;
      }
   }
</style>
