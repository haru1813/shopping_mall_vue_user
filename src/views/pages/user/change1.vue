<script setup>
import { onBeforeMount,ref } from 'vue';
import { dataStore } from '@/stores/dataStore.js';
import { useRouter } from "vue-router";
import { httpRequest } from '@/tool.js';

const router = useRouter();
const dataStores = dataStore();

if(dataStores.authorization == ''){
    router.replace({
        path: `/`,
        query: { t: Date.now() } // 강제 변경 감지
    });
}

const requestData = ref({});

const init = async function(){
    let responData = await httpRequest("POST","https://back1.haru.company/user/id_find",null,dataStores.authorization);
    if(responData.status != 200){
        responData = await httpRequest("POST","https://back1.haru.company/common/token_refresh",null,dataStores.authorization);
        if(responData.status == 200){
            dataStores.authorization = responData.data.token;
            responData = await httpRequest("POST","https://back1.haru.company/user/id_find",null,dataStores.authorization);
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
    if(responData.status == 200){
        requestData.value = responData.data;
        haruMarket_user_id.value.value = requestData.value.haruMarket_user_id;
        haruMarket_user_postCode.value.value = requestData.value.haruMarket_user_postCode;
        haruMarket_user_basicAddress.value.value = requestData.value.haruMarket_user_basicAddress;
        haruMarket_user_detailAddress.value.value = requestData.value.haruMarket_user_detailAddress;
    }
}

const haruMarket_user_id = ref(null);
const haruMarket_user_pw = ref(null);
const haruMarket_user_postCode = ref(null);
const haruMarket_user_basicAddress = ref(null);
const haruMarket_user_detailAddress = ref(null);

const change1 = async function(){
    if(haruMarket_user_pw.value.value==""){
        toastr.error('비밀번호를 입력하여 주십시오.');
        haruMarket_user_pw.value.focus();
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

    let reqData = {
        haruMarket_user_pw : requestData.value.haruMarket_user_pw,
        check_haruMarket_user_pw : haruMarket_user_pw.value.value,
        haruMarket_user_postCode : haruMarket_user_postCode.value.value,
        haruMarket_user_basicAddress : haruMarket_user_basicAddress.value.value,
        haruMarket_user_detailAddress : haruMarket_user_detailAddress.value.value,
    }

    let responData = await httpRequest("POST","https://back1.haru.company/user/change1",reqData,dataStores.authorization);
    if(responData.status != 200){
        responData = await httpRequest("POST","https://back1.haru.company/common/token_refresh",null,dataStores.authorization);
        if(responData.status == 200){
            dataStores.authorization = responData.data.token;
            responData = await httpRequest("POST","https://back1.haru.company/user/change1",reqData,dataStores.authorization);
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
    if(responData.status == 200){
        let data = responData.data;
        if(data.code=="200"){
            toastr.success(data.msg);
        }
        else{
            toastr.error(data.msg);
        }
    }
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

onBeforeMount(async () => {
    window.scrollTo(0, 0);
    await init();
})
</script>
<template>
<div class="container-fluid ps-4 pt-5 pb-5" style='padding-right: 2.6rem !important;'>
    <div class="row">
        <div class="col-12 d-flex justify-content-center align-items-center" style="height: 80px;">
            <span class="display-5 text-dark fw-bold">
                회원 정보 수정
            </span>
        </div>
        <div class="col-12" style="height: 700px;">
            <div class="card h-100 w-100">
                <div class="card-header">
                    회원 정보 수정
                </div>
                <div class="card-body d-flex justify-content-center align-items-center">
                    <h5 class="card-title">
                        <label for="haruMarket_user_id" class="form-label">아이디</label>
                        <input type="text" ref="haruMarket_user_id" class="form-control" disabled readonly>
                        <label for="haruMarket_user_pw" class="form-label">비밀번호</label>
                        <input type="password" ref="haruMarket_user_pw" class="form-control">
                        <label class="form-label">주소</label>
                        <div id="haruMarket_user_address_msg" class="form-text mb-2">
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
                    </h5>
                </div>
                <div class="card-footer">
                    <button type="button" class="btn btn-primary" @click="change1">수정</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>