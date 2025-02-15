<script setup>
import { onMounted,ref,watchEffect, watch } from 'vue';
import { ajax_send } from '@/tool.js';
import { dataStore } from '@/stores/dataStore.js';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
const dataStores = dataStore();

let harumarket_product_name = ref("");
let haruMarket_productCategory_index = ref(0);

let categorys = ref([]);
let page_views = ref([]);

const category_select = function(){
  var formData = new FormData();
  categorys.value = ajax_send(formData,`http://localhost:8080/common/category_select`,"GET");
}

const total_page = function(){
  var formData = new FormData();
  let fdata = {
    haruMarket_productCategory_index: parseInt(haruMarket_productCategory_index.value),
    harumarket_product_name: harumarket_product_name.value,
    page: 0
  }

  var data = ajax_send(formData,`http://localhost:8080/common/total_page2/${JSON.stringify(fdata)}`,"GET");

  console.log(`토탈페이지 : ${data.totalPages}`);

  try{
    $('#pagination-demo').twbsPagination('destroy');
    $('#pagination-demo').twbsPagination({
      totalPages: data.totalPages,
      visiblePages: 5,
      onPageClick: function (event, page) {
        page_view2(page);
      }
    });
  }
  catch (error){
    page_views.value = [];
    $('#pagination-demo').twbsPagination('destroy');
    $('#pagination-demo').twbsPagination({
      totalPages: 1,
      visiblePages: 5,
      onPageClick: function (event, page) {
        page_view2(page);
      }
    });
  }
}

const page_view2 = function(page){
  var formData = new FormData();
  let fdata = {
    haruMarket_productCategory_index: parseInt(haruMarket_productCategory_index.value),
    harumarket_product_name: harumarket_product_name.value,
    page: page
  }

  if(typeof page === "number"){
    //total_page();
    page_views.value = ajax_send(formData,`http://localhost:8080/common/page_view2/${JSON.stringify(fdata)}`,"GET");
  }
  else{
    page_views.value = [];
    $('#pagination-demo').twbsPagination('destroy');
    $('#pagination-demo').twbsPagination({
      totalPages: 1,
      visiblePages: 5,
      onPageClick: function (event, page) {
        page_view2(page);
      }
    });
  }
}

const search = function(){
  total_page();
}

const srcExport = function(harumarket_product_picture){
  const regex = /<img[^>]*src="([^"]*)"/g;
  const match = regex.exec(harumarket_product_picture);
  const srcValue = match[1];
  return srcValue;
}

onMounted(() => {
  harumarket_product_name.value = dataStores.harumarket_product_name;
  category_select();
  total_page();
});

// watchEffect(() =>{
//   harumarket_product_name.value = dataStores.harumarket_product_name;
//   category_select();
//   total_page();
// });

</script>

<template>
  <div class="container-fluid ps-4 pt-5 pb-5" style='padding-right: 2.6rem !important;'>
    <div class="row">
        <div class="col-12 d-flex justify-content-center align-items-center" style="height: 80px;">
            <span class="display-6 text-dark fw-bold">
              상품 검색
            </span>
        </div>
        <div class="col-12 d-flex justify-content-center align-items-center pb-2">
          <div class="w-100 rounded border border-dark p-5">
            <div class="input-group mb-2">
              <span class="input-group-text">상품 카테고리</span>
              <select v-model="haruMarket_productCategory_index" class="form-select" aria-label="Default select example" id="harumarket_productcategory_select">
                <option :value=0 selected>상품 카테고리 선택</option>
                <option v-for="(category, index) in categorys" :key="category.haruMarket_productCategory_index" :value="category.haruMarket_productCategory_index">
                  {{ category.haruMarket_productCategory_name }}
                </option>
              </select>
            </div>
            <div class="input-group mb-2">
              <span class="input-group-text">상품 이름</span>
              <input type="text" aria-label="First name" class="form-control" v-model="harumarket_product_name">
            </div>
            <button class="btn btn-primary" type="button" @click="search">검색</button>
          </div>
        </div>
        <div class="container-fluid">
        <div class="row">
          <div class="col-2 pb-3" v-for="(new_products_item, index) in page_views" :key="index">
            <div class="card" style="width: 18rem;">
              <img :src="srcExport(new_products_item.harumarket_product_picture)" style="cursor:pointer" class="img-thumbnail img-link"></img>
              <div class="card-body">
                <p class="card-title fs-6" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; cursor:pointer;">{{ new_products_item.harumarket_product_name }}</p>
                <span class="badge rounded-pill text-bg-secondary" style="text-decoration: line-through;">{{ new_products_item.harumarket_product_originPrice }}원</span>
                <span class="badge rounded-pill text-bg-primary">{{ new_products_item.harumarket_product_salePrice }}원</span><br/>
                <span class="badge rounded-pill text-bg-success">무료배송</span> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="pagination-container" class="d-flex justify-content-center">
      <ul id="pagination-demo" class="pagination-sm"></ul>
    </div>
  </div>
</template>
