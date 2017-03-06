<template>
  <div id="app">
     <app-header class="header">
        <img src="" alt="Babynamer">
        <nav class="main-nav" slot="main-nav">
           <ul class="main-nav__list">
              <li class="main-nav__item"><button type="button" @click="currentView = 'appMainNames'">My List</button></li>
              <li class="main-nav__item"><button type="button" @click="currentView = 'appFavorites'">My Favorite</button><span>{{ favoriteCount }}</span></li>
           </ul>
        </nav>
     </app-header>
     <app-new-name @addEvent="addName" :userData="userData"></app-new-name>
     <component class="result-box":is="currentView" :clearFavorite="clearFavorite" :removeFavorite="removeFavorite" @selected="selectedNames.push($event)" :names="names" :takeAction="takeAction" :selectedNames="selectedNames"></component>
     <div class="error" v-show="errors[0].status">{{ errors[0].emptyName }}</div>
     <app-footer></app-footer>
     {{ selectedNames }}
  </div>
</template>

<script>
import Header from './components/Header.vue';
import NewName from './components/NewName.vue';
import MainList from './components/MainList.vue';
import Favorites from './components/Favorites.vue';
import Footer from './components/Footer.vue';

export default {
   data() {
      return {
         userData: {
            lastname: '',
            firstname: '',
            patronym: ''
         },
         names: [],
         selectedNames: [],
         currentView: 'appMainNames',
         favoriteCount: 0,
         errorStatus: false,
         errors: [
            {emptyName: 'Поле "Имя" не может быть пустым!', status: false}
         ]
      }
   },
   watch: {

   },
   methods: {
      addName(fullname) {
         if(this.userData.firstname === ''){
            return this.errors[0].status = true;
         }
         var newName = {};
         newName.favorite = false;
         newName.firstname = fullname.firstname;
         newName.lastname = fullname.lastname;
         newName.patronym = fullname.patronym;
         this.names.push(newName);
         console.log(this.names);
         this.userData.firstname = '';
         this.errors[0].status = false;
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
                     vm.favoriteCount++
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
         this.favoriteCount = 0;
         this.names = filterArr;
      },
      removeFavorite(selectedNames) {
         var vm = this;
         for (var i = 0; i < selectedNames.length; i++) {
            this.names.forEach(function(item, index, arr){
               if(item.firstname === selectedNames[i]){
                  arr.splice(index, 1)
                  vm.favoriteCount--
               }
            });
            this.selectedNames = [];
         }
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
      status() {
         var vm = this;
         setTimeout(function(){
            return vm.errors[0].status = false
         }, 5000)
      }
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
