<template>
  <div id="app">
     <app-header class="header">
        <img src="" alt="Babynamer">
        <nav class="main-nav" slot="main-nav">
           <ul class="main-nav__list">
              <li class="main-nav__item"><button type="button" @click="currentView = 'appMainNames'">My List</button></li>
              <li class="main-nav__item"><button type="button" @click="currentView = 'appFavorites'">My Favorite</button><span>{{ favoriteCounter }}</span></li>
           </ul>
        </nav>
     </app-header>
     <app-new-name @addEvent="addName" :userData="userData"></app-new-name>
     <component class="result-box":is="currentView"
               :names="names"
               :clearFavorite="clearFavorite"
               :removeFavorite="removeFavorite"
               :takeAction="takeAction"
               :selectedNames="selectedNames"
               @selected="selectedNames.push($event)"
               @mode="changeModeName"
               :modeList="changeModeList"
               >
                                 </component>
     <div class="error" v-show="errors[0].status">{{ errors[0].emptyName }}</div>
     <div class="error" v-show="errors[1].status">{{ errors[1].repeatInList }}</div>
     <div class="error" v-show="errors[2].status">{{ errors[2].repeatInFavorite }}</div>
     <app-footer :chnames="chnames"></app-footer>
     {{ selectedNames }}
  </div>
</template>

<script>
import Header from './components/Header.vue';
import NewName from './components/NewName.vue';
import MainList from './components/MainList.vue';
import Favorites from './components/Favorites.vue';
import Footer from './components/Footer.vue';
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
      var haveKeys = JSON.parse(localStorage.getItem('keys'));
      if(haveKeys) {
         for(var i = 0; i <= haveKeys.length-1; i++){
            this.names.push( JSON.parse(localStorage.getItem(haveKeys[i])));
            this.favoriteCounter++
         }
         this.keys = haveKeys;
      }
   },
   firebase: {
      chnames: chNames
   },
   data() {
      return {
         userData: {
            lastname: '',
            firstname: '',
            patronym: ''
         },
         names: [],
         keys: [],
         selectedNames: [],
         currentView: 'appMainNames',
         listMode: 0,
         favoriteCounter: 0,
         errorStatus: false,
         errors: [
            {emptyName: 'Поле "Имя" не может быть пустым!', status: false},
            {repeatInList: 'Такое имя уже есть в списке!', status: false},
            {repeatInFavorite: 'Такое имя уже есть в избранном!', status: false}
         ]
      }
   },
   watch: {

   },
   methods: {
      addName(fullname) {
         var vm = this;
         var repeatInFavorite = this.names.some(function(item, index, arr) {
            return item.firstname === fullname.firstname && item.favorite === true
         })
         var repeatInList = this.names.some(function(item, index, arr) {
            return item.firstname === fullname.firstname
         })
         if(this.userData.firstname === ''){
            return this.errors[0].status = true;
         }
         if(repeatInFavorite) {
            return this.errors[2].status = true;
         }
         if(repeatInList) {
            return this.errors[1].status = true;
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
         this.userData.firstname = '';
         this.errors[0].status = false;
         this.errors[1].status = false;
         this.errors[2].status = false;
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
         } else if (action === 'removeName') {
            for (var i = 0; i < selectedNames.length; i++) {
               this.names.forEach(function(item, index, arr){
                  if(item.firstname === selectedNames[i]){
                     arr.splice(index, 1)
                  }
               });
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
               this.selectedNames = [];
            }
         }
      },
      clearFavorite() {
         var filterArr = []
         filterArr = this.names.filter(function(item, index, arr){
            return item.favorite === false;
         });
         this.favoriteCounter = 0;
         localStorage.clear()
         this.names = filterArr;
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
      appMainNames: MainList,
      appFavorites: Favorites,
      appFooter: Footer
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
      background-color: #E6E6FA;
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
   // .list__item {
   //    cursor: pointer;
   // }
   .error {
      text-align: center;
      padding: 10px;
      background-color: #fcbfbf;
   }
</style>
