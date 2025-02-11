<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const move = function(url){
  router.replace(url);
}
</script>

<template>
  <div class="container-fluid border-bottom border-1 border-secondary" style="height: 80px;">
    <div class="row h-100">
      <div class="col-2 d-flex justify-content-center align-items-center">
        <ul class="nav">
          <li class="nav-item">
            <a class="nav-link text-black" aria-current="page" href="/pages/login/login.php">LOGIN</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-black" href="/pages/join/join1.php">JOIN</a>
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
          <input type="text" class="form-control" placeholder="상품을 검색하세요." aria-label="Search" style="width:20px;" id="haruMarket_productCategory_name_search">
          <button class="btn btn-outline-secondary" type="button" id="haruMarket_productCategory_name_searchbtn">
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div> 
    </div>
  </div>
</template>
