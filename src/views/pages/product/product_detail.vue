<script setup>
import { ref,computed,onMounted,watch } from 'vue';
import { ajax_send,sendData,httpRequest } from '@/tool.js';
import { dataStore } from '@/stores/dataStore.js';
import { useRouter } from 'vue-router';
import { buy } from '@/stores/buy.js';
const buyStores = buy();

const router = useRouter();
const dataStores = dataStore();
const productData = ref({});

const optionSelect = async function(url,body,method){
    return await sendData(url,body,method);
}

productData.value = ajax_send(null,`https://back1.haru.company/common/product_view/${dataStores.harumarket_product_index}`,"GET");

const harumarket_product_picture = computed(()=>{
    const regex = /<img[^>]*src="([^"]*)"/g;
    const match = regex.exec(productData.value.harumarket_product_picture);
    const srcValue = match[1];
    return srcValue;
})

const harumarket_product_name = computed(()=>{
    return productData.value.harumarket_product_name;
})

const harumarket_product_originPrice = computed(()=>{
    return productData.value.harumarket_product_originPrice;
})

const harumarket_product_salePrice = computed(()=>{
    return productData.value.harumarket_product_salePrice;
})

const harumarket_product_content = computed(()=>{
    return productData.value.harumarket_product_content;
})

const harumarket_product_colorView = computed(()=>{
    return productData.value.harumarket_product_colorView;
})

const harumarket_product_colors = ref([]);
const harumarket_product_colorsf = async function() {
    if(productData.value.harumarket_product_colorView==1){
        let fdata = {
        harumarket_product_optionIndexs:productData.value.harumarket_product_colorIndexs.replace(/\{/g, "(").replace(/\}/g, ")"),
        table_name:"harumarket_productcolor",
        option_name:"harumarket_productColor_index",
        }

        let respondata = await optionSelect("https://back1.haru.company/common/option_select",fdata,"POST");
        console.log(respondata.data);
        harumarket_product_colors.value = respondata.data;  
    }
}

const harumarket_product_sizeView = computed(()=>{
    return productData.value.harumarket_product_sizeView;
})

const harumarket_product_sizes = ref([]);
const harumarket_product_sizesf = async function(){
    if(productData.value.harumarket_product_sizeView==1){
        let fdata = {
            harumarket_product_optionIndexs:productData.value.harumarket_product_sizeIndexs.replace(/\{/g, "(").replace(/\}/g, ")"),
            table_name:"harumarket_productsize",
            option_name:"harumarket_productSize_index",
        }
        
        let respondata = await optionSelect("https://back1.haru.company/common/option_select",fdata,"POST");
        console.log(respondata.data);
        harumarket_product_sizes.value = respondata.data;  
    }
}

const grid = ref(null);
let gridInstance = null;

onMounted(async () => {
    window.scrollTo(0, 0);
    await harumarket_product_colorsf();
    await harumarket_product_sizesf();
    gridInstance = new tui.Grid({
        el: grid.value,
        data: null,
        scrollX: false,
        scrollY: true,
        bodyHeight: 300,
        rowHeaders: ['checkbox'],
        columns: [
          {
            header: '상품 이름',
            name: 'harumarket_product_name',
            align: 'center',
          },
          {
            header: '상품 색상',
            name: 'harumarket_productColor_name',
            align: 'center',
          },
          {
            header: '상품 크기',
            name: 'harumarket_productSize_name',
            align: 'center',
          },
          {
            header: '상품 개수',
            name: 'harumarket_product_account',
            align: 'center'
          },
          {
            header: '삭제',
            name: 'delete',
            align: 'center',
            formatter: function(value) {
                console.log(value);
                console.log(value.row.rowKey);

                return `<button type="button" class="btn btn-danger btn-sm delete-btn" data-row-key="${value.row.rowKey}">삭제</button>`;
            }
          },
          {
            header: '상품 가격',
            name: 'harumarket_product_salePrice',
            align: 'center',
          },
        ]
    })
});

const harumarket_product_color = ref(null);
const harumarket_product_size = ref(null);

const impl_up = function(){
    const checkedRowKeys = gridInstance.getCheckedRowKeys();
    if(checkedRowKeys.length == 0){
        toastr.error('개수를 증가할 상품을 선택하여 주십시오.');
        return;
    }

    checkedRowKeys.forEach(rowKey =>{
        const row = gridInstance.getRow(rowKey);
        let harumarket_product_account = Number(row.harumarket_product_account);

        if(harumarket_product_account >= 1){
            harumarket_product_account+=1;
            gridInstance.setValue(rowKey, 'harumarket_product_account', harumarket_product_account);

            let price = Number(productData.value.harumarket_product_salePrice.replace(/,/g, '').replace(/원/g, '')) * harumarket_product_account;
            const currency = '원';
            const formattedPrice = price.toLocaleString('ko-KR') + currency;
            gridInstance.setValue(rowKey, 'harumarket_product_salePrice', formattedPrice);
        }
    });

    total();
}

const impl_down = function(){
    const checkedRowKeys = gridInstance.getCheckedRowKeys();
    if(checkedRowKeys.length == 0){
        toastr.error('개수를 감소할 상품을 선택하여 주십시오.');
        return;
    }

    checkedRowKeys.forEach(rowKey =>{
        const row = gridInstance.getRow(rowKey);
        let harumarket_product_account = Number(row.harumarket_product_account);

        if(harumarket_product_account > 1){
            harumarket_product_account-=1;
            gridInstance.setValue(rowKey, 'harumarket_product_account', harumarket_product_account);

            let price = Number(productData.value.harumarket_product_salePrice.replace(/,/g, '').replace(/원/g, '')) * harumarket_product_account;
            const currency = '원';
            const formattedPrice = price.toLocaleString('ko-KR') + currency;
            gridInstance.setValue(rowKey, 'harumarket_product_salePrice', formattedPrice);
        }
    });

    total();
}

const impl_alldelete = function(){
    gridInstance.clear();
    toastr.error('선택한 상품을 전체 삭제하였습니다.');
    total();
}

const option_select = function(){
    let newRowData = {
        harumarket_product_index: dataStores.harumarket_product_index,
        harumarket_product_name: harumarket_product_name.value,
        harumarket_product_account: '1',
        delete:'삭제',
        harumarket_product_salePrice: harumarket_product_salePrice.value
    }

    if(harumarket_product_colorView.value == 1 && harumarket_product_sizeView.value == 1){
        if(harumarket_product_color.value?.value == "" || harumarket_product_size.value?.value == "")
            return;

        newRowData.harumarket_productColor_name = harumarket_product_color.value?.options[harumarket_product_color.value?.selectedIndex].innerText;
        newRowData.harumarket_productColor_index = harumarket_product_color.value?.value;
        newRowData.harumarket_productSize_name = harumarket_product_size.value?.options[harumarket_product_size.value?.selectedIndex].innerText;
        newRowData.harumarket_productSize_index = harumarket_product_size.value?.value;
    }
    if(harumarket_product_colorView.value == 1 && harumarket_product_sizeView.value == 0){
        if(harumarket_product_color.value?.value == "")
            return;

        newRowData.harumarket_productColor_name = harumarket_product_color.value?.options[harumarket_product_color.value?.selectedIndex].innerText;
        newRowData.harumarket_productColor_index = harumarket_product_color.value?.value;
    }
    if(harumarket_product_colorView.value == 0 && harumarket_product_sizeView.value == 1){
        if(harumarket_product_size.value?.value == "")
            return;

        newRowData.harumarket_productSize_name = harumarket_product_size.value?.options[harumarket_product_size.value?.selectedIndex].innerText;
        newRowData.harumarket_productSize_index = harumarket_product_size.value?.value;
    }

    const allData = gridInstance.getData();

    let dataadd = true;

    allData.forEach(function(data, index){
        if(harumarket_product_colorView.value == 1 && harumarket_product_sizeView.value == 1){
            if((newRowData.harumarket_productColor_index == data.harumarket_productColor_index) &&
                (newRowData.harumarket_productSize_index == data.harumarket_productSize_index)){
                    toastr.error("이미 해당 옵션으로 선택되어 있습니다.");
                    dataadd = false;
            }
        }
        if(harumarket_product_colorView.value == 1 && harumarket_product_sizeView.value == 0){
            if((newRowData.harumarket_productColor_index == data.harumarket_productColor_index)){
                    toastr.error("이미 해당 옵션으로 선택되어 있습니다.");
                    dataadd = false;
            }
        }
        if(harumarket_product_colorView.value == 0 && harumarket_product_sizeView.value == 1){
            if((newRowData.harumarket_productSize_index == data.harumarket_productSize_index)){
                    toastr.error("이미 해당 옵션으로 선택되어 있습니다.");
                    dataadd = false;
                }
        }
    })

    if(dataadd){
        gridInstance.appendRow(newRowData);
    }

    total();
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
            let harumarket_product_account = Number(data.harumarket_product_account);
            total_count += harumarket_product_account;
            let harumarket_product_salePrice = Number(data.harumarket_product_salePrice.replace(/,/g, '').replace(/원/g, ''));
            total_price += harumarket_product_salePrice;
        });

        totaln.value = `${total_price.toLocaleString('ko-KR')}원 (${total_count}개)`;
    }
}

const basket = async function(){
    if(dataStores.authorization == ""){
        toastr.error("로그인 후에 해당 기능을 이용하여 주십시오.");
        return;
    }

    let allData = gridInstance.getData();

    if(allData.length == 0){
        toastr.error("상품 옵션을 선택하여 주십시오.");
    }
    else{
        let harumarket_userBusket_Inserts = [];

        allData.forEach(function(data, index){
            let harumarket_userBusket_Insert = {
                harumarket_product_index : productData.value.harumarket_product_index,
                harumarket_productColor_index : data.harumarket_productColor_index !== undefined ? data.harumarket_productColor_index : 0,
                harumarket_productSize_index : data.harumarket_productSize_index !== undefined ? data.harumarket_productSize_index : 0,
                harumarket_userBasket_account : data.harumarket_product_account
            }
            harumarket_userBusket_Inserts.push(harumarket_userBusket_Insert);
        });

        let data = await httpRequest("POST","https://back1.haru.company/user/busket_insert",harumarket_userBusket_Inserts,dataStores.authorization);
        console.log(data.status);
        if(data.status == 500){
            toastr.error("장바구니는 10개까지만 등록 가능합니다.");
        }
        if(data.status != 200){
            let data2 = await httpRequest("POST","https://back1.haru.company/common/token_refresh",null,dataStores.authorization);
            if(data2.status == 200){
                dataStores.authorization = data2.data.token;
                data = await httpRequest("POST","https://back1.haru.company/user/busket_insert",harumarket_userBusket_Inserts,dataStores.authorization);
            }
            else{
                toastr.error("로그아웃 되었습니다.");
                dataStores.authorization = "";
                router.go(0);
            }
        }
        if(data.status == 200){
            toastr.success("장바구니를 등록하였습니다.");
        }
    }
}

const buyF = function(){
    if(dataStores.authorization == ""){
        toastr.error("로그인 후에 해당 기능을 이용하여 주십시오.");
        return;
    }

    let allData = gridInstance.getData();

    if(allData.length == 0){
        toastr.error("상품 옵션을 선택하여 주십시오.");
    }
    else{
        const harumarket_userBuy = [];

        allData.forEach(function(data, index){
            const harumarket_userBuyItem = {};
            harumarket_userBuyItem["harumarket_product_index"] = Number(data.harumarket_product_index);
            harumarket_userBuyItem["harumarket_productColor_index"] = data.harumarket_productColor_index !== undefined ? Number(data.harumarket_productColor_index) : 0;
            harumarket_userBuyItem["harumarket_productSize_index"] = data.harumarket_productSize_index !== undefined ? Number(data.harumarket_productSize_index) : 0;
            harumarket_userBuyItem["harumarket_product_count"] = Number(data.harumarket_product_account); 
            harumarket_userBuy.push(harumarket_userBuyItem);
        });

        buyStores.harumarket_userBuy = harumarket_userBuy;
        buyStores.haruMarket_buy_ready = true;

        router.replace({
            path: `/buy`,
            query: { t: Date.now() } // 강제 변경 감지
        });
    }
}

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')){
        const rowKey = event.target.dataset.rowKey;
        gridInstance.removeRow(rowKey);
        total();
    }
})

</script>

<template>
<div class="container-fluid ps-4 pt-5 pb-5" style='padding-right: 2.6rem !important;'>
    <div class="row">
        <div class="col-12 d-flex justify-content-center align-items-center">
            <div class="card w-100">
                <div class="row">
                    <div class="col-4 p-0" id="harumarket_product_picture">
                        <img :src="harumarket_product_picture" class="img-fluid rounded-start">
                    </div>
                    <div class="col-8 p-0 pt-2 ps-2 pe-3">
                        <div class="card-body p-0 h-100">
                            <h5 class="card-title"></h5>
                            <p class="card-title fs-3">{{ harumarket_product_name }}</p>
                            <span class="badge rounded-pill text-bg-secondary" style="text-decoration: line-through;" id="harumarket_product_originPrice">{{ harumarket_product_originPrice }}</span>
                            <span class="badge rounded-pill text-bg-primary" id="harumarket_product_salePrice">{{ harumarket_product_salePrice }}</span><br/>
                            <span class="badge rounded-pill text-bg-success">무료배송</span>

                            <p class="card-body mb-0" id="harumarket_options">
                                <select class="form-select mt-2" aria-label="Default select example"
                                v-if="harumarket_product_colors.length > 0"
                                ref="harumarket_product_color"
                                @change="option_select">
                                    <option value="" selected>[필수] 색상 옵션을 선택해주세요.</option>
                                    <option v-for="(color, index) in harumarket_product_colors" 
                                    :key="index"
                                    :value="color.harumarket_productColor_index">
                                        {{ color.harumarket_productColor_name }}
                                    </option>
                                </select>

                                <select class="form-select mt-2" aria-label="Default select example"
                                v-if="harumarket_product_sizes.length > 0"
                                ref="harumarket_product_size"
                                @change="option_select">
                                    <option value="" selected>[필수] 크기 옵션을 선택해주세요.</option>
                                    <option v-for="(size, index) in harumarket_product_sizes" 
                                    :key="index"
                                    :value="size.harumarket_productSize_index">
                                        {{ size.harumarket_productSize_name }}
                                    </option>
                                </select>
                            </p>

                            <div class="d-grid gap-2 d-md-block mt-2">
                                <button class="btn btn-success btn-sm me-1" type="button" @click="buyF">구매하기</button>
                                <button class="btn btn-primary btn-sm" type="button" @click="basket">장바구니 담기</button>
                            </div>

                            <span class="badge bg-info text-dark fs-6 mt-2 me-1">TOTAL(수량)</span>
                            <span class="badge bg-info text-dark fs-6">{{ totaln }}</span>
                            <div class="d-grid gap-2 d-md-block mt-2">
                                <button class="btn btn-secondary btn-sm me-1" type="button" @click="impl_up">상품 개수 증가</button>
                                <button class="btn btn-secondary btn-sm me-1" type="button" @click="impl_down">상품 개수 감소</button>
                                <button class="btn btn-secondary btn-sm" type="button" @click="impl_alldelete">상품 전체 삭제</button>
                            </div>
                            <div class="mt-2" ref="grid"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-12 pt-2 text-center" v-html="harumarket_product_content"></div>
        
    </div>
</div>    
</template>