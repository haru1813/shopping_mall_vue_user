<script setup>
import { ref,onBeforeMount, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { dataStore } from '@/stores/dataStore.js';
import { storeToRefs } from 'pinia';
import { httpRequest } from '@/tool.js';

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

const logout = function(){
  dataStores.authorization = "";
  router.go(0);
}

const move2 = async function(url){
  let data = await httpRequest("POST","http://localhost:8080/user/move2",null,dataStores.authorization);
  if(data.status != 200){
    console.log("토큰 유효하지 않음");
    let data2 = await httpRequest("POST","http://localhost:8080/common/token_refresh",null,dataStores.authorization);
    if(data2.status == 200){
      console.log("토큰 재발급");
      dataStores.authorization = data2.data.token;
      data = await httpRequest("POST","http://localhost:8080/user/move2",null,dataStores.authorization);
      router.replace({
        path: url,
        query: { t: Date.now() } // 강제 변경 감지
      });
    }
    else{
      toastr.error("로그인 유효기간이 만료되었습니다.");
      dataStores.authorization = "";
      router.replace({
        path: "/",
        query: { t: Date.now() } // 강제 변경 감지
      });
    }
  }
  else{
    console.log("토큰 유효");
    router.replace({
        path: url,
        query: { t: Date.now() } // 강제 변경 감지
    });
  }
}
</script>

<template>
  <div class="container-fluid border-bottom border-1 border-secondary" style="height: 80px;" v-if="dataStores.authorization === ''">
    <div class="row h-100">
      <div class="col-2 d-flex justify-content-center align-items-center">
        <ul class="nav">
          <li class="nav-item">
            <a class="nav-link text-black" style="cursor:pointer" aria-current="page" @click="move('/login')">LOGIN</a>
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

  <div class="container-fluid border-bottom border-1 border-secondary" style="height: 80px;" v-else>
    <div class="row h-100">
      <div class="col-2 d-flex justify-content-center align-items-center">
        <ul class="nav">
          <li class="nav-item">
            <a class="nav-link text-black" aria-current="page" style="cursor:pointer" @click="logout">LOGOUT</a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle text-black" data-bs-toggle="dropdown" href="#" style="cursor:pointer" role="button" aria-expanded="false">MY PAGE</a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" style="cursor:pointer" @click="move2('/login')">회원 정보 수정</a></li>
              <li><a class="dropdown-item" style="cursor:pointer" href="/pages/user/change1.php">비밀번호 변경</a></li>
              <li><a class="dropdown-item" style="cursor:pointer" href="/pages/user/change1.php">장바구니</a></li>
              <li><a class="dropdown-item" style="cursor:pointer" href="/pages/user/change1.php">주문 조회</a></li>
            </ul>
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
