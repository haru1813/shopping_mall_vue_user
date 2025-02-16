<script setup>
import { dataStore } from '@/stores/dataStore.js';
import { buy } from '@/stores/buy.js';
import { onMounted,ref } from 'vue';
import { useRouter } from 'vue-router';
import { httpRequest } from '@/tool.js';

const router = useRouter();
const dataStores = dataStore();
const buyStores = buy();
const information = ref({});

const haruMarket_user_name = ref(null);
const haruMarket_user_postCode = ref(null);
const haruMarket_user_basicAddress = ref(null);
const haruMarket_user_detailAddress = ref(null);
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
    information.value = await information_find();

    haruMarket_user_name.value.value = information.value.haruMarket_user_name;
    haruMarket_user_postCode.value.value = information.value.haruMarket_user_postCode;
    haruMarket_user_basicAddress.value.value = information.value.haruMarket_user_basicAddress;
    haruMarket_user_detailAddress.value.value = information.value.haruMarket_user_detailAddress;

    product_informations.value = await product_information_view();

    let harumarket_product_totalPriceValue = 0;

    product_informations.value.map((item,index)=>{
        harumarket_product_totalPriceValue += Object.assign({}, item).harumarket_product_salePrice;
    })

    harumarket_product_totalPrice.value = `최종 결제 금액 : ${harumarket_product_totalPriceValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`;
})

const information_find = async function(){
    let responData = await httpRequest("POST","http://localhost:8080/user/information_find",null,dataStores.authorization);
    if(responData.status != 200){
        responData = await httpRequest("POST","http://localhost:8080/common/token_refresh",null,dataStores.authorization);
        if(responData.status == 200){
            dataStores.authorization = responData.data.token;
            responData = await httpRequest("POST","http://localhost:8080/user/information_find",null,dataStores.authorization);
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

const information_setting = function(event){
    if(event.target.value == 0){
        haruMarket_user_name.value.value = "";
        haruMarket_user_postCode.value.value = "";
        haruMarket_user_basicAddress.value.value = "";
        haruMarket_user_detailAddress.value.value = "";
    }
    else{
        haruMarket_user_name.value.value = information.value.haruMarket_user_name;
        haruMarket_user_postCode.value.value = information.value.haruMarket_user_postCode;
        haruMarket_user_basicAddress.value.value = information.value.haruMarket_user_basicAddress;
        haruMarket_user_detailAddress.value.value = information.value.haruMarket_user_detailAddress;
    }
}

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

const product_detail = function(harumarket_product_index){
    dataStores.harumarket_product_index = harumarket_product_index;
    router.replace({
        path: "/product_detail",
        query: { t: Date.now() } // 강제 변경 감지
    });
}

const addressFind = function(){
    new window.daum.Postcode({
        oncomplete: function(data){
            var roadAddr = data.roadAddress; // 도로명 주소 변수
            var jibunAddress = data.jibunAddress; // 지번 주소 변수
            var extraRoadAddr = ''; // 참고 항목 변수

            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
            if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                extraRoadAddr += data.bname;
            }
            // 건물명이 있고, 공동주택일 경우 추가한다.
            if(data.buildingName !== '' && data.apartment === 'Y'){
                extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
            if(extraRoadAddr !== ''){
                extraRoadAddr = ' (' + extraRoadAddr + ')';
            }

            haruMarket_user_postCode.value.value = data.zonecode;
            haruMarket_user_basicAddress.value.value = jibunAddress;
        }
    }).open();
}

const purchase = async function(pay_method_value){
    if(haruMarket_user_name.value.value == ""){
        toastr.error('받는 사람 이름이 입력되지 않았습니다.');
        haruMarket_user_name.value.focus();
        return;
    }
    if(haruMarket_user_name.value.value.length > 20){
        toastr.error('이름은 20자를 넘지 않도록 입력하여 주십시오.');
        haruMarket_user_name.value.focus();
        return;
    }
    if(haruMarket_user_postCode.value.value == "" || haruMarket_user_basicAddress.value.value == ""){
        toastr.error('우편번호 버튼을 클릭하여 주소를 검색하여 주십시오.');
        return;
    }
    if(haruMarket_user_detailAddress.value.value == ""){
        toastr.error('상세 주소가 입력되지 않았습니다.');
        haruMarket_user_detailAddress.value.focus();
        return;
    }
    if(haruMarket_user_detailAddress.value.value.length > 30){
        toastr.error('상세 주소는 30자를 넘지 않도록 입력하여 주십시오.');
        haruMarket_user_detailAddress.value.focus();
        return;
    }

    let responData = await httpRequest("POST","http://localhost:8080/user/product_buy_try",[...buyStores.harumarket_userBuy],dataStores.authorization);
    if(responData.status != 200){
        responData = await httpRequest("POST","http://localhost:8080/common/token_refresh",null,dataStores.authorization);
        if(responData.status == 200){
            dataStores.authorization = responData.data.token;
            responData = await httpRequest("POST","http://localhost:8080/user/product_buy_try",[...buyStores.harumarket_userBuy],dataStores.authorization);
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
    else{
        console.log(responData);
        IMP.init("imp43126142");
        IMP.request_pay(
            {
                pg: "html5_inicis", // PG사 코드표에서 선택
                pay_method: pay_method_value, // 결제 방식
                merchant_uid: `harumarket_${responData.data.haruMarket_user_phone}_${merchant_uid_output()}`, // 결제 고유 번호
                name: `harumarket_${responData.data.haruMarket_user_phone}_${merchant_uid_output()}`, // 제품명
                amount: responData.data.harumarket_product_salePrice, // 가격
                //구매자 정보 ↓
                buyer_email: "",
                buyer_name: haruMarket_user_name.value.value,
                buyer_tel: responData.data.haruMarket_user_phone,
                buyer_addr: `${haruMarket_user_basicAddress.value.value} ${haruMarket_user_detailAddress.value.value}`,
                buyer_postcode: responData.data.haruMarket_user_phone,
                },
                async function (rsp) {
                if (rsp.success) {
                    // 인증 성공 시 로직,
                    //console.log(rsp);

                    let requestData = {
                        haruMarket_BuyMaster_order : rsp.merchant_uid,
                        haruMarket_BuyMaster_buyerName : rsp.buyer_name,
                        haruMarket_BuyMaster_buyerPostcode : rsp.buyer_postcode,
                        haruMarket_BuyMaster_buyerAddr : rsp.buyer_addr,
                        haruMarket_BuyMaster_buyerMethod : rsp.pay_method,
                        haruMarket_BuyMaster_amount : rsp.paid_amount
                    }

                    let responData = await httpRequest("POST","http://localhost:8080/user/product_buy_master",requestData,dataStores.authorization);
                    if(responData.status != 200){
                        responData = await httpRequest("POST","http://localhost:8080/common/token_refresh",null,dataStores.authorization);
                        if(responData.status == 200){
                            dataStores.authorization = responData.data.token;
                            responData = await httpRequest("POST","http://localhost:8080/user/product_buy_master",requestData,dataStores.authorization);
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

                    let tharumarket_userBuy = [...buyStores.harumarket_userBuy];

                    tharumarket_userBuy = tharumarket_userBuy.map(product_information => {
                        return {
                            ...product_information, // 기존 프로퍼티 복사
                            haruMarket_BuyMaster_order: rsp.merchant_uid, // 새로운 프로퍼티 추가
                        };
                    });

                    responData = await httpRequest("POST","http://localhost:8080/user/product_buy_detail",tharumarket_userBuy,dataStores.authorization);
                    if(responData.status != 200){
                        responData = await httpRequest("POST","http://localhost:8080/common/token_refresh",null,dataStores.authorization);
                        if(responData.status == 200){
                            dataStores.authorization = responData.data.token;
                            responData = await httpRequest("POST","http://localhost:8080/user/product_buy_detail",tharumarket_userBuy,dataStores.authorization);
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

                    let tharumarket_userBasket_indexs = [...buyStores.harumarket_userBasket_indexs];

                    if(tharumarket_userBasket_indexs.length > 0){
                        responData = await httpRequest("POST","http://localhost:8080/user/userBasket_delete",tharumarket_userBasket_indexs,dataStores.authorization);
                        if(responData.status != 200){
                            responData = await httpRequest("POST","http://localhost:8080/common/token_refresh",null,dataStores.authorization);
                            if(responData.status == 200){
                                dataStores.authorization = responData.data.token;
                                responData = await httpRequest("POST","http://localhost:8080/user/userBasket_delete",tharumarket_userBasket_indexs,dataStores.authorization);
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
                        buyStores.harumarket_userBasket_indexs.splice(0);
                    }

                    buyStores.haruMarket_buy_ready = true;

                    router.replace({
                        path: `/buy_complete`,
                        query: { t: Date.now() } // 강제 변경 감지
                    });
                }
            }
        );
    }
}

const merchant_uid_output = function(){
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고, 2자리로 맞춤
    const day = String(today.getDate()).padStart(2, '0'); // 2자리로 맞춤
    const hours = String(today.getHours()).padStart(2, '0'); // 2자리로 맞춤
    const minutes = String(today.getMinutes()).padStart(2, '0'); // 2자리로 맞춤

    const formattedDate = `${year}${month}${day}${hours}${minutes}`;

    return formattedDate;
}

</script>
<template>
<div class="container-fluid ps-4 pt-5 pb-5" style='padding-right: 2.6rem !important;'>
    <div class="row">
        <div class="col-12 d-flex justify-content-center align-items-center" style="height: 80px;">
            <span class="display-5 text-dark fw-bold">
                주문/결제
            </span>
        </div>
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">배송지</h5>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="informationRadio" :value=1 checked @change="information_setting">
                        <label class="form-check-label" for="inlineRadio1">회원정보와 동일</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="informationRadio" :value=0 @change="information_setting">
                        <label class="form-check-label" for="inlineRadio2">새로운 배송지</label>
                    </div>
                    <div class="mt-3">
                        <label for="haruMarket_user_name" class="form-label">* 받는 사람 이름</label>
                        <input type="text" class="form-control" ref="haruMarket_user_name" placeholder="이름 입력">
                    </div>
                    <label class="form-label mt-3 mb-0">* 주소</label>
                    <div id="haruMarket_user_address_msg" class="form-text">
                        우편번호를 클릭하여 주소를 입력하여 주십시오.
                    </div>
                    <div class="row g-3 align-items-center mb-1">
                        <div class="col-auto">
                            <input type="text" ref="haruMarket_user_postCode" class="form-control" placeholder="우편번호" disabled readonly>
                        </div>
                        <div class="col-auto">
                            <button type="button" class="btn btn-primary" @click="addressFind">우편번호</button>
                        </div>
                    </div>
                    <input type="text" ref="haruMarket_user_basicAddress" class="form-control mb-1" placeholder="기본 주소" disabled readonly>
                    <input type="text" ref="haruMarket_user_detailAddress" class="form-control" placeholder="상세 주소">
                </div>
            </div>
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
                <div class="card-footer">
                    {{ harumarket_product_totalPrice }}
                </div>
            </div>
        </div>
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <button type="button" class="btn btn-primary me-1" @click="purchase('card')">카드 결제</button>
                    <button type="button" class="btn btn-primary me-1" @click="purchase('phone')">휴대폰 소액 결제</button>
                    <button type="button" class="btn btn-primary me-1" @click="purchase('naverpay')">네이버페이 결제</button>
                    <button type="button" class="btn btn-primary me-1" @click="purchase('kakaopay')">카카오페이 결제</button>
                </div>
            </div>
        </div>
    </div>
</div>    
</template>