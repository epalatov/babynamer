<template>
  <div id="app">
     <div class="header-wrap navbar navbar-default">
        <div class="container main-header">
           <div class="row">
           <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <img class="navbar-brand" src="/src/assets/logo.svg" alt="Babynamer">
          </div>

          <app-header>
            <img class="logo" src="/src/assets/logo.svg" alt="Babynamer">
            <span class="beta-lable">&beta;eta</span>
            <nav class="main-nav collapse navbar-collapse" id="bs-example-navbar-collapse-1" slot="main-nav">
               <ul class="main-nav-list nav navbar-nav">
                  <li class="main-nav-list__item"><button type="button" @click="setActive('appMainNames'); currentView = 'appMainNames'" :class="{ active : isMain }">Рабочий список</button></li>
                  <li class="main-nav-list__item"><button type="button" @click="setActive('churchNames'); currentView = 'appMainNames'; churchNamesOptions = !churchNamesOptions" :class="{ active : isChurch }">Церковные имена</button></li>
                  <li class="main-nav-list__item"><button type="button" @click="setActive('appFavorites'); currentView = 'appFavorites'; churchNamesOptions = false" :class="{ active : isFavorite }">Избранные имена</button><span class="favorite-counter"><i v-if="favoriteCounter == 0" class="fa fa-heart-o" aria-hidden="true"></i><i v-if="favoriteCounter > 0" class="fa fa-heart" aria-hidden="true"></i>{{ favoriteCounter }}</span></li>
               </ul>
            </nav>
         </app-header>
         </div>
       </div>
     </div>
     <div class="option-wrap"   v-show="churchNamesOptions && currentView === 'appMainNames'">
         <app-options :getChurchNames="getChurchNames"></app-options>
     </div>
     <div class="new-name-wrap" v-show="currentView !== 'appFavorites'">
        <div class="container">
           <app-new-name @addEvent="addName" :userData="userData"></app-new-name>
       </div>
     </div>
     <div class="result-box-wrap">
        <div class="container">
              <component class="":is="currentView"
                       :names="names"
                       :favoriteListEmpty="favoriteListEmpty"
                       :mainListEmpty="mainListEmpty"
                       :clearFavorite="clearFavorite"
                       :currentView="currentView"
                       :removeFavorite="removeFavorite"
                       :takeAction="takeAction"
                       :selectedNames="selectedNames"
                       @selected="pushSelectedNames($event)"
                       @mode="changeModeName"
                       :modeList="changeModeList"
                       >
             </component>
        </div>
     </div>
     <transition name="slide">
        <div class="error" v-show="emptyName">{{ errors[0].emptyName }}</div>
     </transition>
     <transition name="slide">
        <div class="error" v-if="repeatInList">{{ errors[1].repeatInList }}</div>
     </transition>
     <transition name="slide">
        <div class="error" v-if="repeatInFavorite">{{ errors[2].repeatInFavorite }}</div>
     </transition>
     <transition name="slide">
        <div class="error"  v-if="unacceptableSymbols">{{ errors[3].unacceptableSymbols }}</div>
     </transition>
     <app-donate v-show="donateShow" :changeDonateShow="changeDonateShow" class="donate"><slot></slot></app-donate>
     <app-footer :changeDonateShow="changeDonateShow"
                  :changeCurrentView="changeCurrentView"
               ></app-footer>
  </div>
</template>

<script>
import { myMixin } from './myMixin';
import Header from './components/Header.vue';
import Options from './components/Options.vue';
import NewName from './components/NewName.vue';
import mainList from './components/MainList.vue';
import Favorites from './components/Favorites.vue';
import Donate from './components/Donate.vue';
import Footer from './components/Footer.vue';
import About from './components/About.vue';
import Firebase from 'firebase';

let config = {
   apiKey: "AIzaSyA-1SfsVk8zHQSiB9n6llK8jdiOCd1hfAs",
   authDomain: "babyname-ee096.firebaseapp.com",
   databaseURL: "https://babyname-ee096.firebaseio.com",
   storageBucket: "babyname-ee096.appspot.com",
   messagingSenderId: "272322713073"
}

let app = Firebase.initializeApp(config);
let db = app.database();
let chNames = db.ref('chnames');

export default {
   created() {
      var vm = this;
      var haveKeys = JSON.parse(localStorage.getItem('keys'));
      if(haveKeys) {
         for(var i = 0; i <= haveKeys.length-1; i++){
            this.names.push( JSON.parse(localStorage.getItem(haveKeys[i])));
            this.favoriteCounter++
         }
      this.keys = haveKeys;
      this.names.forEach(function(item, index){
         item.selected = false;
         if(item.favorite === false){
            vm.mainListEmpty = false;
         } else if(item.favorite === true){
            vm.favoriteListEmpty = false;
         } else {
            vm.favoriteListEmpty = true;
            vm.mainListEmpty = true;
         }
      })
      }
   },
   firebase: {
      chnames: chNames
   },
   watch: {

   },
   data() {
      return {
         userData: {
            lastname: '',
            firstname: '',
            patronym: ''
         },
         isMain: true,
         isChurch: false,
         isFavorite: false,
         displayBlock: '',
         names: [],
         keys: [],
         donateShow: false,
         mainListEmpty: true,
         favoriteListEmpty: true,
         selectedNames: [],
         churchNamesOptions: false,
         currentView: 'appMainNames',
         listMode: 0,
         favoriteCounter: 0,
         emptyName: false,
         repeatInList: false,
         repeatInFavorite: false,
         unacceptableSymbols: false,
         errors: [
            {emptyName: 'Поле "Имя" не может быть пустым!'},
            {repeatInList: 'Такое имя уже есть в списке!'},
            {repeatInFavorite: 'Такое имя уже есть в избранном!'},
            {unacceptableSymbols: 'Ошибка! Недопустимые символы'}
         ]
      }
   },
   methods: {
      setActive: function(view) {
         if (view == 'appMainNames') {
            this.isFavorite = false;
            this.isChurch = false;
            this.isMain = true;
         } else if(view == 'appFavorites'){
            this.isFavorite = true;
            this.isMain = false;
            this.isChurch = false;
         }
      },
      showError(error) {
         var vm = this;
         switch (error) {
            case 'emptyName': this.emptyName = true;
            setTimeout(function(){ vm.emptyName = false; }, 5000);
            break;
            case 'repeatInList': this.repeatInList = true;
            setTimeout(function(){ vm.repeatInList = false; }, 5000);
            break;
            case 'repeatInFavorite': this.repeatInFavorite = true;
            setTimeout(function(){ vm.repeatInFavorite = false; }, 5000);
            break;
            case 'unacceptableSymbols': this.unacceptableSymbols = true;
            setTimeout(function(){ vm.unacceptableSymbols = false; }, 5000);
            break;
         }
      },
      pushSelectedNames(name) {
         var selected = this.selectedNames.some(function(item, index){
            return item === name;
         });
         if(selected === false) {
            this.selectedNames.push(name);
         } else {
            this.selectedNames.forEach(function(item, index, arr) {
               if(item === name){
                  arr.splice(index, 1)
               }
            })
         }
      },
      changeCurrentView() {
         this.currentView = 'appAbout';
         this.isMain = false;
      },
      changeDonateShow() {
         this.donateShow = !this.donateShow
      },
      showChurchNames() {
         this.currentView = 'appMainNames';
      },
      getChurchNames(gender, date){
         var resultQuery = this.chnames.filter(function(obj, index, arr){
            return obj.gender === gender && obj.date === date;
         })
         for (var i = 0; i < resultQuery.length; i++) {
            this.userData.lastname = this.userData.lastname;
            this.userData.patronym = this.userData.patronym;
            this.userData.firstname = resultQuery[i].name;
            this.addName(this.userData);
         }
      },
      addName(fullname) {
         var vm = this;
         var reg = /[#<>!№@:;"$&0123456789]/ig;
         var item1 = fullname.firstname.match(reg)
         var item2 = fullname.lastname.match(reg)
         var item3 = fullname.patronym.match(reg)
         console.log(item1)
         console.log(item2)
         console.log(item3)
         if(item1 != null){
            return this.showError('unacceptableSymbols');
         }
         if(item2 != null){
            return this.showError('unacceptableSymbols');
         }
         if(item3 != null){
            return this.showError('unacceptableSymbols');
         }
         var repeatInFavorite = this.names.some(function(item, index, arr) {
            return item.firstname === fullname.firstname && item.favorite === true
         })
         var repeatInList = this.names.some(function(item, index, arr) {
            return item.firstname === fullname.firstname
         })
         if(this.userData.firstname === ''){
            return this.showError('emptyName');
         }
         if(repeatInFavorite) {
            return this.showError('repeatInFavorite');
         }
         if(repeatInList) {
            return this.showError('repeatInList');
         }

         var newName = {};
         newName.favorite = false;
         newName.mode = 0;
         newName.selected = false;
         newName.lastname = fullname.lastname;
         newName.firstname = fullname.firstname;
         newName.patronym = fullname.patronym;
         switch (this.listMode) {
            case 0: newName.curMode = `${newName.lastname} ${newName.firstname} ${newName.patronym}`;
            break;
            case 1: newName.curMode = `${fullname.firstname}`;
            break;
            case 2: newName.curMode = `${fullname.firstname} ${fullname.lastname}`;
            break;
            case 3: newName.curMode = `${fullname.firstname} ${fullname.patronym} ${fullname.lastname}`;
            break;
            case 4: newName.curMode = `${fullname.lastname} ${fullname.firstname}`;
         }
         this.names.push(newName);
         this.mainListEmpty = false;
         this.currentView = 'appMainNames';
         this.userData.firstname = '';
         this.errors[0].status = false;
         this.errors[1].status = false;
         this.errors[2].status = false;
         this.errors[3].status = false;
      },
      takeAction(selectedNames, action) {
         var vm = this;
         console.log(selectedNames)
         console.log(action)
         if (action === 'clearList') {
            var filterArr = []
            filterArr = this.names.filter(function(item, index, arr){
               return item.favorite === true;
            });
            this.names = filterArr;
            this.selectedNames = [];
            this.mainListEmpty = true;
         } else if (action === 'removeName') {
            for (var i = 0; i < selectedNames.length; i++) {
               this.names.forEach(function(item, index, arr){
                  if(item.firstname === selectedNames[i]){
                     arr.splice(index, 1)
                  }
               });
               var notEmpty = this.names.some(function(item, index, arr){
                  return item.favorite === false
               })
               if(notEmpty){
                  this.mainListEmpty = false;
               }else {
                  this.mainListEmpty = true;
               }
               this.selectedNames = [];
            }
         } else if (action === 'toFavorite') {
            for (var i = 0; i < selectedNames.length; i++) {
               this.names.forEach(function(item, index, arr){
                  if(item.firstname === selectedNames[i]){
                     item.selected = false;
                     item.favorite = true;
                     vm.favoriteCounter++;
                     vm.keys.push(item.firstname);
                     localStorage.setItem(item.firstname, JSON.stringify(item));
                     localStorage.setItem('favoriteCounter', vm.favoriteCounter);
                     localStorage.setItem('keys', JSON.stringify(vm.keys));
                  }
               });
            }
            this.favoriteListEmpty = false;
            var mainListHaveItemthis = this.names.some(function(item, index, arr){
               return item.favorite === false
            })
            if(mainListHaveItemthis){
               this.mainListEmpty = false;
            } else {
               this.mainListEmpty = true;
            }
            this.selectedNames = [];
         }
      },
      clearFavorite() {
         var filterArr = []
         filterArr = this.names.filter(function(item, index, arr){
            return item.favorite === false;
         });
         this.favoriteCounter = 0;
         localStorage.clear()
         this.favoriteListEmpty = true;
         this.names = filterArr;
         this.selectedNames = [];
      },
      removeFavorite(selectedNames) {
         var vm = this;
         var curKey;
         for (var i = 0; i < selectedNames.length; i++) {
            this.keys.forEach(function(key, index){
               if (key === selectedNames[i]) {
                  curKey = selectedNames[i];
                  console.log(curKey)
               }
            })
            this.names.forEach(function(name, index, arr){
               if(name.firstname === selectedNames[i]){
                  arr.splice(index, 1);
                  localStorage.removeItem(curKey);
                  vm.favoriteCounter--
                  localStorage.setItem('favoriteCounter', vm.favoriteCounter);
                  if(vm.favoriteCounter === 0){
                     localStorage.clear()
                     vm.keys = [];
                     vm.favoriteListEmpty = true;
                  } else {
                     vm.keys.forEach(function(item, index){
                        if(item === selectedNames[i]) {
                           vm.keys.splice(index, 1)
                           localStorage.setItem('keys', JSON.stringify(vm.keys));
                        }
                     });
                  }
               }
            });
            this.selectedNames = [];
         }
      },
      changeModeName(fullname) {
         this.selectedNames = [];
         var vm = this;
         this.names.forEach(function(item, index, arr){
            if(item.firstname === fullname.firstname) {
               item.mode === 4 ? item.mode = 0 : item.mode++;
               switch (item.mode) {
                  case 0: item.curMode = `${fullname.lastname} ${fullname.firstname} ${fullname.patronym}`; break;
                  case 1: item.curMode = `${fullname.firstname}`; break;
                  case 2: item.curMode = `${fullname.firstname} ${fullname.lastname}`; break;
                  case 3: item.curMode = `${fullname.firstname} ${fullname.patronym} ${fullname.lastname}`; break;
                  case 4: item.curMode = `${fullname.lastname} ${fullname.firstname}`; break;
               }
               console.log('Change mode name: ' + item.mode)
            }
         });

      },
      changeModeList() {
         switch (this.listMode) {
            case 0:
            this.names.forEach(function(item){ item.mode = 1; });
            break;
            case 1:
            this.names.forEach(function(item){ item.mode = 2});
            break;
            case 2:
            this.names.forEach(function(item){ item.mode = 3});
            break;
            case 3:
            this.names.forEach(function(item){ item.mode = 4});
            break;
            case 4:
            this.names.forEach(function(item){ item.mode = 0});
            break;

         }
         this.selectedNames = [];
         var vm = this;
         vm.listMode === 4 ? vm.listMode = 0 : vm.listMode++;
         this.names.forEach(function(item, index, arr){
            switch (vm.listMode) {
               case 0: item.curMode = `${item.lastname} ${item.firstname} ${item.patronym}`; break;
               case 1: item.curMode = `${item.firstname}`; break;
               case 2: item.curMode = `${item.firstname} ${item.lastname}`; break;
               case 3: item.curMode = `${item.firstname} ${item.patronym} ${item.lastname}`; break;
               case 4: item.curMode = `${item.lastname} ${item.firstname}`; break;
            }
         });
         console.log('Change mode list: ' + this.listMode)
      }
   },
   components: {
      appHeader: Header,
      appNewName: NewName,
      appMainNames: mainList,
      appFavorites: Favorites,
      appFooter: Footer,
      appOptions: Options,
      appDonate: Donate,
      appAbout: About
   },
   directives: {
      //v-local-highlight:background.delayed.blink="{mainColor: '#B0C4DE', secondColor: '#DB7093', delay: 500}"
      'local-highlight': {
         bind(el, binding, vnode) {
            var delay = 0;
            if(binding.modifiers['delayed']){
               delay = 3000;
            }
            if (binding.modifiers['blink']) {
               let mainColor = binding.value.mainColor;
               let secondColor = binding.value.secondColor;
               let currentColor = mainColor;
               setTimeout(function(){
                  setInterval(function(){
                     currentColor == secondColor ? currentColor = mainColor : currentColor = secondColor;
                     if(binding.arg == 'background'){
                        el.style.backgroundColor = currentColor;
                     } else {
                        el.style.color = currentColor;
                     }
                  }, binding.value.delay)
               }, delay);
            } else {
               setTimeout(function(){
                  if(binding.arg == 'background'){
                     el.style.backgroundColor = binding.value.mainColor;
                  } else {
                     el.style.color = binding.value.mainColor;
                  }
               }, delay);
            }
         }
      }
   },
   computed: {

   }
}
</script>

<style lang="scss">
   .logo {
      width: 172px;
      height: 48px;
      @media (max-width: 767px) {
         display: none;
      }
   }
   .header-wrap {
      height: 65px;
      background-color: #fff;
      padding-top: 6px;
      box-shadow: 0 2px 2px 0 rgba(34, 34, 34, 0.1);
      .beta-lable {
         color: #bfbfbf;
         @media (max-width: 767px) {
            display: none;
         }
         @media (max-width: 767px) {
            display: none;
         }
         @media (max-width: 991px) {
            display: none;
         }
      }
   }
   .main-nav {
      padding-top: 13px;
      float: right;
      .main-nav-list {
         padding: 0;
         margin: 0;
         &__item {
            display: inline-block;
            list-style: none;
            cursor: pointer;
            i {
               font-family: 'FontAwesome';
               color: #D86979;
            }
            @media (max-width: 767px) {
               display: block;
               padding-bottom: 8px;
            }
            button {
               background: none;
               padding: 0;
               border: 0;
               margin-right: 20px;
               font-size: 18px;
               color: darken(#e6e6e6, 55%);
               outline: none;
               &:hover {
                  color: #D86979;
               }
            }
            .active {
               color: #D86979;
            }
         }
         @media (max-width: 767px) {
            padding-top: 10px;
            padding-bottom: 10px;
         }
      }
      @media (max-width: 767px) {
         width: 100%;
         padding-left: 25px;
      }
   }
   .option-wrap {
      padding: 20px;
      background-color: #6D4657;
   }
   .new-name-wrap {
      background-color: #B3D5C4;
      text-align: center;
   }
   .result-box-wrap {
      background-color: #f2f1ee;
      @media (max-width: 767px) {
         padding: 0;
      }
   }
   .list-box {
      padding: 50px 60px;
      @media (max-width: 991px) {
         padding: 25px 25px;
      }
      @media (max-width: 767px) {
         padding: 12px 5px;
      }
      .list {
         padding: 0;
         margin: 0;
      }
      background-color: #fff;
      box-shadow: 4px 4px 0 0 #dedcd7;
      &__item {
      list-style: none;
      color: #3e3e3e;
      cursor: pointer;
      font-size: 22px;
      padding: 5px 20px;
      &:hover {
         color: darken(#D86979, 3%);
      }
      @media (max-width: 767px) {
         font-size: 16px;
      }
      }
   }

   .control-btns {
      text-align: center;
      margin-bottom: 30px;
      @media (max-width: 767px) {
         margin-bottom: 40px;
      }
      button {
         color: #816161;
         text-align: center;
         background: none;
         border: 0;
         padding: 0;
         outline: 0;
         margin: 0 10px;
         font-size: 18px;
         line-height: 20px;
         border-bottom: 1px dashed darken(#e6e6e6, 20%);
         @media (max-width: 767px) {
            margin: 12px auto;
            display: block;
         }
         &:hover {
            border-bottom: none;
         }
      }
      &__mode {
         color: #7abbe0;
      }
   }
   .error {
      text-align: center;
      padding: 10px;
      background-color: #fcbfbf;
   }
   .empty-list {
      font-size: 16px;
      text-align: center;
      padding: 20px 0;
      color: #adadad;
   }
   .favorite-counter {
      font-size: 16px;
      color: #D86979;
      i {
         color: #D86979;
         margin-right: 5px;
      }
   }

   // Animation classes
   .fade-enter {
      opacity: 0;
   }
   .fade-enter-active {
      transition: opacity .3s;
   }
   .fade-leave-active {
      transition: opacity .3s;
      opacity: 0;
   }
   .slide-enter {
      opacity: 0;
   }
   .slide-enter-active {
      transition: opacity .3s;
      animation: slide-in .3s ease-out forwards;
   }
   .slide-leave-active {
      transition: opacity .3s;
      opacity: 0;
      animation: slide-out .3s ease-out forwards;
   }
   @keyframes slide-in {
      from {
         transform: translateY(-10px);
      }
      to {
         transform: translateY(0);
      }
   }
   @keyframes slide-out {
      from {
         transform: translateY(0);
      }
      to {
         transform: translateY(-10px);
      }
   }

   // Bootstrap
   .navbar-default, .navbar-collapse {
      border: none;
   }
   .container.main-header {
      @media (max-width: 767px) {
         background-color: #fff;
         box-shadow: 0 3px 5px 0 rgba(34, 34, 34, 0.2);
      }
   }
   .navbar {
      margin-bottom: 0;
   }
   .navbar-brand {
      height: 50px;
      padding: 0;
      margin-left: 20px;
      @media (min-width: 767px) {
         display: none;
      }
   }
   .navbar-header {
      height: 60px;
   }
   .navbar-toggle {
      margin-top: 10px;
   }
   .navbar-default .navbar-toggle:focus, .navbar-default .navbar-toggle:hover {
      background-color: #fff;
   }
   .navbar-default .navbar-toggle {
      border: none;
   }
</style>
