<template>
  <div id="app">
     <app-header class="header">
        <img src="" alt="Babynamer">
        <nav class="main-nav" slot="main-nav">
           <ul class="main-nav__list">
              <li class="main-nav__item"><button type="button" @click="currentView = 'appMainNames'; churchNamesOptions = !churchNamesOptions">Church names</button></li>
              <li class="main-nav__item"><button type="button" @click="currentView = 'appMainNames'">My List</button></li>
              <li class="main-nav__item"><button type="button" @click="currentView = 'appFavorites'; churchNamesOptions = false">My Favorite</button><span>{{ favoriteCounter }}</span></li>
           </ul>
        </nav>
     </app-header>
     <app-options class="options-panel" v-show="churchNamesOptions && currentView === 'appMainNames'" :getChurchNames="getChurchNames"></app-options>
     <app-new-name @addEvent="addName" :userData="userData"  v-show="currentView !== 'appFavorites'"></app-new-name>
     <component class="result-box":is="currentView"
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
     {{ selectedNames }}
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
     <app-donate v-show="donateShow" class="donate"></app-donate>
     <app-footer :changeDonateShow="changeDonateShow"
               :changeCurrentView="changeCurrentView"></app-footer>
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
         var reg = /[#<>!№@:();"$&0-9]/g;
         var item1 = fullname.firstname.match(reg)
         var item2 = fullname.lastname.match(reg)
         var item3 = fullname.patronym.match(reg)
         if(item1 !== null){
            return this.showError('unacceptableSymbols');
         } else if (item2 !== null){
            return this.showError('unacceptableSymbols');
         } else if (item3 !== null) {
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
         console.log(this.names);
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
   #app {
      padding: 20px;
      font-family: Helvetica, Arial, sans-serif;
   }
   .header {
      margin-bottom: 30px;
   }
   .main-nav {
      float: right;
   }
   .result-box {
      padding: 10px;
   }
   .main-nav__list {
      padding: 0;
      margin: 0;
      .main-nav__item {
         display: inline-block;
         list-style: none;
         cursor: pointer;
      }
   }
   .error {
      text-align: center;
      padding: 10px;
      background-color: #fcbfbf;
   }
   .options-panel {
      padding: 15px 0;
      background-color: #a5dcde;
      text-align: center;
      margin-bottom: 30px;
   }
   .empty-list {
      text-align: center;
      padding: 20px 0;
   }

   .fade-enter {
      opacity: 0;
   }
   .fade-enter-active {
      transition: opacity .3s;
   }
   .fade-leave {
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
   .slide-leave {

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
</style>
