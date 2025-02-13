<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { dataStore } from '@/stores/dataStore.js';
import { storeToRefs } from 'pinia';
const router = useRouter();
const dataStores = dataStore();

let harumarket_product_name = ref("");

const move = function(url){
  router.replace({
    path: url,
    query: { t: Date.now() } // 강제 변경 감지
  });
}

const haruMarket_productCategory_name_search = function(){
  dataStores.harumarket_product_name = harumarket_product_name.value;
  move("/product_search");
}
</script>

<template>
  <div class="container-fluid border-bottom border-1 border-secondary" style="height: 80px;">
    <div class="row h-100">
      <div class="col-2 d-flex justify-content-center align-items-center">
        <ul class="nav">
          <li class="nav-item">
            <a class="nav-link text-black" style="cursor:pointer" aria-current="page" href="/pages/login/login.php">LOGIN</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-black" style="cursor:pointer" @click="move('/join1')">JOIN</a>
          </li>
        </ul>
      </div>
      <div class="col-8 d-flex justify-content-center align-items-center">
        <span class="display-5 text-primary fw-bold">
          <a class="text-decoration-none" style="cursor:pointer" @click="move('/')">HARU MARKET</a>
        </span>
      </div> 
      <div class="col-2 d-flex align-items-center">
        <div class="input-group m-3">
          <input type="text" class="form-control" placeholder="상품을 검색하세요." aria-label="Search" style="width:20px;" v-model="harumarket_product_name" @keyup.enter="haruMarket_productCategory_name_search">
          <button class="btn btn-outline-secondary" type="button" id="haruMarket_productCategory_name_searchbtn" @click="haruMarket_productCategory_name_search">
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div> 
    </div>
  </div>
</template>
