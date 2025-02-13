<script setup>
import { onMounted,ref,watchEffect, watch } from 'vue';
import { ajax_send } from '@/tool.js';
import { dataStore } from '@/stores/dataStore.js';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
const dataStores = dataStore();

let haruMarket_productCategory_name = ref("");
const route = useRoute();
const productId = ref(route.params.id);

const haruMarket_productCategory_name_view = function(){
  var formData = new FormData();
  var data = ajax_send(formData,`http://localhost:8080/common/haruMarket_productCategory_name/${dataStores.haruMarket_productCategory_index}`,"GET");
  haruMarket_productCategory_name.value = data.haruMarket_productCategory_name;
}

const total_page = function(){
  var formData = new FormData();
  var data = ajax_send(formData,`http://localhost:8080/common/total_page/${dataStores.haruMarket_productCategory_index}`,"GET");
  
  $('#pagination-demo').twbsPagination('destroy');

  $('#pagination-demo').twbsPagination({
    totalPages: data.totalPages,
    visiblePages: 5,
    onPageClick: function (event, page) {
      page_view(page);
    }
  });
}

let page_views = ref([]);

const page_view = function(page){
  var formData = new FormData();
  page_views.value = ajax_send(formData,`http://localhost:8080/common/page_view/${dataStores.haruMarket_productCategory_index}/${page}`,"GET");
}

const srcExport = function(harumarket_product_picture){
  const regex = /<img[^>]*src="([^"]*)"/g;
  const match = regex.exec(harumarket_product_picture);
  const srcValue = match[1];
  return srcValue;
}

watchEffect(() => {
  productId.value = route.params.id;
  haruMarket_productCategory_name_view();
  total_page();
});

onMounted(() => {
  haruMarket_productCategory_name_view();
  total_page();
});

watch(haruMarket_productCategory_name, (currentValue, prevValue) =>{
  haruMarket_productCategory_name_view();
  total_page();
});
</script>

<template>
  <div class="container-fluid ps-4 pt-5 pb-5" style='padding-right: 2.6rem !important;'>
      <div class="row">
        <div class="col-12 d-flex justify-content-center align-items-center">
            <span class="display-6 text-dark fw-bold">
                {{ haruMarket_productCategory_name }}
            </span>
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
      <div id="pagination-container" class="d-flex justify-content-center">
        <ul id="pagination-demo" class="pagination-sm"></ul>
      </div>
  </div>
</template>
