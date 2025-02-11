<script setup>
import { onMounted,ref,watchEffect } from 'vue';
import { ajax_send } from '@/tool.js';
import { dataStore } from '@/stores/dataStore.js';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
const dataStores = dataStore();

let haruMarket_productCategory_name = ref("전체상품");
const route = useRoute();
const productId = ref(route.params.id);

const haruMarket_productCategory_name_view = function(){
  console.log(dataStores.haruMarket_productCategory_index);
  if(productId.value==0){
    haruMarket_productCategory_name.value = "전체상품";
  }
  else
  {
    haruMarket_productCategory_name.value = "다른상품";
  }
}

watchEffect(() => {
  productId.value = route.params.id;
  haruMarket_productCategory_name_view();
});

onMounted(() => {
  haruMarket_productCategory_name_view();
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
  </div>
</template>
