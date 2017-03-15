<template lang="html">
   <div class="footer">
      <div class="print">
         <span class="print__button" onclick="window.print()"><i class="fa fa-print print__icon" aria-hidden="true"></i>Распечатать список</span>
      </div>
      <div class="share-button">
         <div class="ya-share2" data-services="vkontakte,facebook,odnoklassniki"></div>
      </div>
      <div class="footer-menu">
         <button class="footer-menu__item" type="button" @click="changeCurrentView()">О проекте</button>
         <i class="fa fa-circle" aria-hidden="true"></i>
         <a href="http://babynamer.reformal.ru" title="Отзывы и пожелания" target="_blank" class="footer-menu__item">Отзывы и пожелания</a>
         <i class="fa fa-circle" aria-hidden="true"></i>
         <button class="footer-menu__item" type="button" @click="changeDonateShow()">Donate</button>
      </div>
      <p class="copy">Ⓒ Babynamer, {{ year }}</p>
   </div>
</template>

<script>
export default {
   data() {
      return {
         year: new Date().getFullYear()
      }
   },
   props: {
      changeDonateShow: Function,
      changeCurrentView: Function
   }
}
</script>

<style lang="scss">
   .footer {
      text-align: center;
      .share-button {
         margin-bottom: 15px;
      }
      .copy {
         padding-top: 15px;
         color: #aaaaaa;
      }
      @media (max-width: 767px) {
         padding-top: 30px;
         padding-bottom: 20px;
      }
      @media (max-width: 991px) {
         padding-top: 30px;
      }

   }
   .footer-menu {
      i {
         font-size: 3px;
         margin-left: 5px;
         vertical-align: middle;
         color: darken(#B3D5C4, 10%)
      }
      &__item {
         font-size: 16px;
         outline: none;
         margin-left: 5px;
         padding: 0;
         border: 0;
         background: 0;
         color: darken(#B3D5C4, 10%);
         &:last-child:after {
            content: "";
         }
         &:hover {
            color: #D86979;
         }
      }
   }
   a.footer-menu__item {
      text-decoration: none;
      &:visited {
         color: darken(#B3D5C4, 10%);
      }
      &:hover {
         color: #D86979;
      }
   }
   .print {
      &__button {
         color: #6c6e6f;
         border: 2px solid #f2f1ee;
         font-size: 18px;
         display: inline-block;
         cursor: pointer;
         padding: 15px 25px;
         margin-top: 40px;
         margin-bottom: 40px;
         &:hover {
            border-color: #B3D5C4;
            color: darken(#B3D5C4, 20%);
         }
         @media (max-width: 767px) and (max-width: 991px)  {
            display: none;
         }
      }
      &__icon {
         color: darken(#B3D5C4, 20%);
         margin-right: 20px;
         font-size: 20px;
      }

   }
</style>
