<script setup>
import { onMounted,ref } from 'vue';
import { ajax_send } from '../tool.js';
import { dataStore } from '@/stores/dataStore.js';
import { useRouter } from 'vue-router';

const dataStores = dataStore();
const router = useRouter();

const swiper = ref(null);

let advertise_items = ref([]);
let new_products_items = ref([]);
const advertise_view = function(){
  var formData = new FormData();
  advertise_items.value = ajax_send(formData,"http://localhost:8080/common/advertise","GET");
}
const new_products_view = function(){
  var formData = new FormData();
  new_products_items.value = ajax_send(formData,"http://localhost:8080/common/new_products","GET");
}

onMounted(() => {
  advertise_view();
  swiper.value = new Swiper('.swiper', {
  slidesPerView: 6,
  spaceBetween: 10,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  new_products_view();
});

const srcExport = function(harumarket_product_picture){
  const regex = /<img[^>]*src="([^"]*)"/g;
  const match = regex.exec(harumarket_product_picture);
  const srcValue = match[1];
  return srcValue;
}

const product_detail = function(harumarket_product_index){
  dataStores.harumarket_product_index = harumarket_product_index;
  router.replace({
    path: "/product_detail",
    query: { t: Date.now() } // 강제 변경 감지
  });
}
</script>

<template>
  <div class="container-fluid ps-4 pt-5 pb-5" style='padding-right: 2.6rem !important;'>
      <div class="row">
        <div class="col-12 d-flex justify-content-center align-items-center">
            <span class="display-6 text-dark fw-bold">
                WEEKLY BEST
            </span><br/>
        </div>
        <div class="col-12 d-flex justify-content-center align-items-center">
            <span class="text-secondary fw-bold">
                지금 가장 사랑받는 상품입니다 :)
            </span>
        </div>
        <div class="col-12">
            <!-- Swiper -->
            <div class="swiper mySwiper" ref="swiper">
                <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="(advertise_item, index) in advertise_items" :key="index">
                    <div class="card" style="width: 18rem;">
                      <img :src="srcExport(advertise_item.harumarket_product_picture)" style="cursor:pointer" class="img-thumbnail img-link" @click="product_detail(advertise_item.harumarket_product_index)"></img>
                      <div class="card-body">
                        <p class="card-title fs-6" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; cursor:pointer;" @click="product_detail(advertise_item.harumarket_product_index)">{{ advertise_item.harumarket_product_name }}</p>
                        <span class="badge rounded-pill text-bg-secondary" style="text-decoration: line-through;">{{ advertise_item.harumarket_product_originPrice }}원</span>
                        <span class="badge rounded-pill text-bg-primary">{{ advertise_item.harumarket_product_salePrice }}원</span><br/>
                        <span class="badge rounded-pill text-bg-success">무료배송</span> 
                      </div>
                    </div>
                  </div>
                </div>
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 d-flex justify-content-center align-items-center" style="height: 80px;">
            <span class="display-6 text-dark fw-bold">
                NEW ARRIVALS
            </span>
        </div>
      </div>
      <div class="container-fluid">
          <div class="row">
            <div class="col-2 pb-3" v-for="(new_products_item, index) in new_products_items" :key="index">
              <div class="card" style="width: 18rem;">
                <img :src="srcExport(new_products_item.harumarket_product_picture)" style="cursor:pointer" class="img-thumbnail img-link" @click="product_detail(new_products_item.harumarket_product_index)"></img>
                <div class="card-body">
                  <p class="card-title fs-6" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; cursor:pointer;" @click="product_detail(new_products_item.harumarket_product_index)">{{ new_products_item.harumarket_product_name }}</p>
                  <span class="badge rounded-pill text-bg-secondary" style="text-decoration: line-through;">{{ new_products_item.harumarket_product_originPrice }}원</span>
                  <span class="badge rounded-pill text-bg-primary">{{ new_products_item.harumarket_product_salePrice }}원</span><br/>
                  <span class="badge rounded-pill text-bg-success">무료배송</span> 
                </div>
              </div>
            </div>
          </div>
      </div>
  </div>
</template>
