<script setup>
import { onMounted,ref } from 'vue';
import { dataStore } from '@/stores/dataStore.js';
import { useRouter } from "vue-router";
import { httpRequest } from '@/tool.js';
import { buy } from '@/stores/buy.js';

const router = useRouter();
const dataStores = dataStore();
const buyStores = buy();

const grid = ref(null);
let gridInstance = null;
onMounted( async ()=>{
    if(dataStores.authorization == ''){
        router.replace({
            path: `/`,
            query: { t: Date.now() } // 강제 변경 감지
        });
    }
    gridInstance = new tui.Grid({
        el: grid.value,
        data: null,
        scrollX: false,
        scrollY: true,
        bodyHeight: 560,
        rowHeaders: ['checkbox'],
        rowHeight: 140,
        columns: [
        {
            header: '이미지',
            name: 'harumarket_product_picture',
            align: 'center',
            width:120,
            formatter: function(val) {
                const regex = /<img[^>]*src="([^"]*)"/g; // 정규 표현식
                const match = regex.exec(val.value);
                const srcValue = match[1];

                return `<img src="${srcValue}" width="100" style="cursor:pointer" class="img-thumbnail img-link" data-row-key="${val.row.rowKey}"></img>`;
            }
          },
          {
            header: '상품 이름',
            name: 'harumarket_product_name',
            align: 'center',
            formatter: function(val) {
              return `<span style="cursor:pointer" class="span-link" data-row-key="${val.row.rowKey}">${val.value}</span>`;
            }
          },
          {
            header: '상품 색상',
            name: 'harumarket_productColor_name',
            align: 'center',
            width:100,
          },
          {
            header: '상품 크기',
            name: 'harumarket_productSize_name',
            align: 'center',
            width:100,
          },
          {
            header: '상품 개수',
            name: 'harumarket_userBasket_account',
            align: 'center',
            width:100,
          },
          {
            header: '상품 가격',
            name: 'harumarket_product_salePrice',
            align: 'center',
            width:100,
            formatter: function(val) {
              return `<span>${val.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</span>`;
            }
          }
        ]
    })

    let responData = await basket_select();
    gridInstance.resetData(responData.data);
    total();
})

const basket_select = async function(){
    let responData = await httpRequest("POST","https://back1.haru.company/user/basket_select",null,dataStores.authorization);
    if(responData.status != 200){
        responData = await httpRequest("POST","https://back1.haru.company/common/token_refresh",null,dataStores.authorization);
        if(responData.status == 200){
            dataStores.authorization = responData.data.token;
            responData = await httpRequest("POST","https://back1.haru.company/user/basket_select",null,dataStores.authorization);
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
    return responData;
}

const totaln = ref("0원 (0개)");

const total = function(){
    let allData = gridInstance.getData();
    if(allData.length == 0){
        totaln.value = "0원 (0개)";
    }
    else{
        let total_count = 0;
        let total_price = 0;

        allData.forEach(function(data, index) {
            let harumarket_product_account = data.harumarket_userBasket_account;
            total_count += harumarket_product_account;
            let harumarket_product_salePrice = data.harumarket_product_salePrice;
            total_price += harumarket_product_salePrice;
        });

        totaln.value = `${total_price.toLocaleString('ko-KR')}원 (${total_count}개)`;
    }
}

const deleteF = async function(){
    let checkedRowKeys = gridInstance.getCheckedRowKeys();

    if(checkedRowKeys.length == 0){
      toastr.error('삭제할 상품을 선택하여 주십시오.');
      return;
    }

    let reqData = [];

    checkedRowKeys.forEach(rowKey => {
        const row = gridInstance.getRow(rowKey);

        let req = {
            harumarket_userBasket_index : row.harumarket_userBasket_index
        }

        reqData.push(req);
    });

    let responData = await httpRequest("POST","https://back1.haru.company/user/basket_delete",reqData,dataStores.authorization);
    if(responData.status != 200){
        responData = await httpRequest("POST","https://back1.haru.company/common/token_refresh",reqData,dataStores.authorization);
        if(responData.status == 200){
            dataStores.authorization = responData.data.token;
            responData = await httpRequest("POST","https://back1.haru.company/user/basket_delete",reqData,dataStores.authorization);
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
    let data = responData.data;
    toastr.success(data.msg);

    responData = await basket_select();
    gridInstance.resetData(responData.data);
    total();
}

const order = function(){
    let checkedRowKeys = gridInstance.getCheckedRowKeys();

    if(checkedRowKeys.length == 0){
      toastr.error('주문할 상품을 선택하여 주십시오.');
      return;
    }

    const harumarket_userBasket_indexs = [];
    const harumarket_userBuy = [];
    
    checkedRowKeys.forEach(rowKey => {
        const row = gridInstance.getRow(rowKey);

        const harumarket_userBasket_index = {
            "harumarket_userBasket_index":row.harumarket_userBasket_index
        };

        harumarket_userBasket_indexs.push(harumarket_userBasket_index);

        const harumarket_userBuyItem = {};
        harumarket_userBuyItem["harumarket_product_index"] = Number(row.harumarket_product_index);
        harumarket_userBuyItem["harumarket_productColor_index"] = Number(row.harumarket_productColor_index); 
        harumarket_userBuyItem["harumarket_productSize_index"] = Number(row.harumarket_productSize_index); 
        harumarket_userBuyItem["harumarket_product_count"] = Number(row.harumarket_userBasket_account); 

        harumarket_userBuy.push(harumarket_userBuyItem);
    });

    buyStores.harumarket_userBasket_indexs = harumarket_userBasket_indexs;
    buyStores.harumarket_userBuy = harumarket_userBuy;
    buyStores.haruMarket_buy_ready = true;

    router.replace({
        path: `/buy`,
        query: { t: Date.now() } // 강제 변경 감지
    });
}

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('img-link') || event.target.classList.contains('span-link')) {
        const rowKey = event.target.dataset.rowKey;

        const row = gridInstance.getRow(rowKey);

        dataStores.harumarket_product_index = row.harumarket_product_index;
        router.replace({
            path: "/product_detail",
            query: { t: Date.now() } // 강제 변경 감지
        });
    }
});
</script>
<template>
<div class="container-fluid ps-4 pt-5 pb-5" style='padding-right: 2.6rem !important;'>
    <div class="row">
        <div class="col-12 d-flex justify-content-center align-items-center" style="height: 80px;">
            <span class="display-5 text-dark fw-bold">
                장바구니
            </span>
        </div>
        <div class="col-12" style="height: 700px;">
            <div class="card h-100 w-100">
                <div class="card-body d-flex justify-content-center align-items-center m-0 p-0">
                    <div ref="grid" class="h-100 w-100"></div>
                </div>
                <div class="m-0 p-1">
                    <span class="badge bg-info text-dark fs-6 me-1">TOTAL(수량)</span>
                    <span class="badge bg-info text-dark fs-6" id="total">{{ totaln }}</span>
                </div>
                <div class="card-footer">
                    <button type="button" class="btn btn-danger me-1" @click="deleteF">삭제</button>
                    <button type="button" class="btn btn-primary" @click="order">주문</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>