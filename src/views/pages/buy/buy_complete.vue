<script setup>
import { dataStore } from '@/stores/dataStore.js';
import { buy } from '@/stores/buy.js';
import { onMounted,ref } from 'vue';
import { useRouter } from 'vue-router';
import { httpRequest } from '@/tool.js';

const router = useRouter();
const dataStores = dataStore();
const buyStores = buy();
const product_informations = ref([]);
const harumarket_product_totalPrice = ref("");

onMounted(async ()=>{
    if(dataStores.authorization == '' || buyStores.haruMarket_buy_ready == false){
        router.replace({
            path: `/`,
            query: { t: Date.now() } // 강제 변경 감지
        });
    }
    buyStores.haruMarket_buy_ready = false;

    product_informations.value = await product_information_view();

    let harumarket_product_totalPriceValue = 0;

    product_informations.value.map((item,index)=>{
        harumarket_product_totalPriceValue += Object.assign({}, item).harumarket_product_salePrice;
    })

    harumarket_product_totalPrice.value = `최종 결제 금액 : ${harumarket_product_totalPriceValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`;
})

const product_information_view = async function(){
    let responData = await httpRequest("POST","http://localhost:8080/user/product_information_view",[...buyStores.harumarket_userBuy],dataStores.authorization);
    if(responData.status != 200){
        responData = await httpRequest("POST","http://localhost:8080/common/token_refresh",null,dataStores.authorization);
        if(responData.status == 200){
            dataStores.authorization = responData.data.token;
            responData = await httpRequest("POST","http://localhost:8080/user/product_information_view",[...buyStores.harumarket_userBuy],dataStores.authorization);
        }
        else{
            toastr.error("로그아웃 되었습니다.");
            dataStores.authorization = "";
            router.replace({
                path: `/`,
                query: { t: Date.now() } // 강제 변경 감지
            });
        }
    }
    return responData.data;
}

const srcExport = function(harumarket_product_picture){
  const regex = /<img[^>]*src="([^"]*)"/g;
  const match = regex.exec(harumarket_product_picture);
  const srcValue = match[1];
  return srcValue;
}

const move = async function(url){
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
        toastr.error("로그아웃 되었습니다.");
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
<div class="container-fluid ps-4 pt-5 pb-5" style='padding-right: 2.6rem !important;'>
    <div class="row">
        <div class="col-12 d-flex justify-content-center align-items-center" style="height: 80px;">
            <span class="display-5 text-dark fw-bold">
                결제 완료
            </span>
        </div>
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">주문 상품</h5>
                    <div class="container-fluid" id="order_products">
                        <div class="row border border-dark rounded mb-2" v-for="(product_information, index) in product_informations" :key="index">
                            <div class="col-2 d-flex justify-content-center align-items-center">
                                <img :src="srcExport(product_information.harumarket_product_picture)" style="cursor:pointer" width="100" class="img-thumbnail img-link" @click="product_detail(product_information.harumarket_product_index)"></img>
                            </div>
                            <div class="col-10">
                                <p class="text-dark" style="cursor:pointer" @click="product_detail(product_information.harumarket_product_index)">
                                    {{product_information.harumarket_product_name}}
                                </p>
                                <p class="text-secondary mb-0">
                                    [옵션: 
                                    {{ product_information.harumarket_productColor_name === null ? "" : product_information.harumarket_productColor_name }} 
                                    {{ product_information.haruMarket_productCategory_name === null ? "" : product_information.haruMarket_productCategory_name }}
                                    ]
                                </p>
                                <p class="text-secondary">
                                    수량: {{product_information.harumarket_product_count}}개
                                </p>
                                <p class="text-dark mb-0">
                                    {{product_information.harumarket_product_salePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}}원
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer" id="harumarket_product_totalPrice">
                    {{ harumarket_product_totalPrice }}
                </div>
            </div>
        </div>
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <button type="button" class="btn btn-primary" @click="move('/order')">주문 조회로 이동</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>