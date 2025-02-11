<script setup>
import { onBeforeMount, ref } from "vue";
import { ajax_send } from "../../tool.js";
import { useRouter } from "vue-router";
import { dataStore } from '@/stores/dataStore.js';
import { storeToRefs } from 'pinia';
const dataStores = dataStore();

const router = useRouter();
let categorys = ref([]);

const harumarket_productcategory = async function () {
  var formData = new FormData();
  categorys.value = await ajax_send(formData, "http://localhost:8080/common/category", "GET");
};

onBeforeMount(() => {
  harumarket_productcategory();
});

const moveNav = function (haruMarket_productCategory_index) {
  dataStores.haruMarket_productCategory_index = haruMarket_productCategory_index;
  router.replace({
    path: `/product_list/${haruMarket_productCategory_index}`,
    query: { t: Date.now() } // 강제 변경 감지
  });
};
</script>

<template>
  <ul class="nav border-bottom border-1 border-secondary justify-content-center" id="harumarket_productcategory">
    <li class="nav-item">
      <a class="nav-link text-black" aria-current="page" role="button" @click.prevent="moveNav(0)">전체상품</a>
    </li>
    <li class="nav-item" v-for="(category, index) in categorys" :key="index">
      <a class="nav-link text-black" aria-current="page" role="button" @click.prevent="moveNav(category.haruMarket_productCategory_index)">
        {{ category.haruMarket_productCategory_name }}
      </a>
    </li>
  </ul>
</template>
