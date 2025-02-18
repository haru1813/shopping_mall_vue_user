<script setup>
import { ajax_send } from '@/tool.js';
import { join } from '@/stores/join';
import { onBeforeMount,ref } from 'vue';
import { useRouter } from "vue-router";
import axios from 'axios';
import { dataStore } from '@/stores/dataStore.js';

const router = useRouter();
const dataStores = dataStore();

onBeforeMount(() => {
    if(dataStores.authorization != ''){
        router.replace({
            path: `/`,
            query: { t: Date.now() } // 강제 변경 감지
        });
    }
});

const haruMarket_user_id = ref(null);
const haruMarket_user_pw = ref(null);
const haruMarket_user_pwCheck = ref(null);
const haruMarket_user_postCode = ref(null);
const haruMarket_user_basicAddress = ref(null);
const haruMarket_user_detailAddress = ref(null);

onBeforeMount(() => {
  if(!join.haruMarket_join_certification){
    router.replace({
        path: `/`,
        query: { t: Date.now() } // 강제 변경 감지
    });
  }
});

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



const validataTest = function(text){
    const regex = /^[a-z0-9]{1,20}$/;
    return regex.test(text);
}

const joinf = function(){
    if(haruMarket_user_id.value.value == ""){
        toastr.error('아이디를 입력하여 주십시오.');
        haruMarket_user_id.value.focus();
        return;
    }
    if(!validataTest(haruMarket_user_id.value.value)){
        toastr.error('아이디는 영소문자 또는 숫자만 포함하여 4~20자(20자) 입력하여주십시오.');
        document.getElementById('haruMarket_user_id').focus();
        return;
    }
    if(haruMarket_user_pw.value.value == ""){
        toastr.error('비밀번호를 입력하여 주십시오.');
        haruMarket_user_pw.value.focus();
        return;
    }
    if(!validataTest(haruMarket_user_pw.value.value)){
        toastr.error('비밀번호는 영소문자 또는 숫자만 포함하여 4~20자(20자) 입력하여주십시오.');
        document.getElementById('haruMarket_user_pw').focus();
        return;
    }
    if(haruMarket_user_pw.value.value != haruMarket_user_pwCheck.value.value){
        toastr.error('비밀번호와 비밀번호 확인 값이 서로 다릅니다.');
        haruMarket_user_pw.value.focus();
        return;
    }
    if(haruMarket_user_postCode.value.value == "" || haruMarket_user_basicAddress.value.value == ""){
        toastr.error('우편번호 버튼을 클릭하여 주소를 검색하여 주십시오.');
        return;
    }
    if(haruMarket_user_detailAddress.value.value == ""){
            toastr.error('상세 주소가 입력되지 않았습니다.');
            document.getElementById('haruMarket_user_detailAddress').focus();
            return;
    }
    if(haruMarket_user_detailAddress.value.value.length > 30){
        toastr.error('상세 주소는 30자를 넘지 않도록 입력하여 주십시오.');
        haruMarket_user_detailAddress.value.focus();
        return;
    }

    let fdata = {
        haruMarket_user_id : haruMarket_user_id.value.value,
        haruMarket_user_pw : haruMarket_user_pw.value.value,
        haruMarket_user_postCode : haruMarket_user_postCode.value.value,
        haruMarket_user_basicAddress : haruMarket_user_basicAddress.value.value,
        haruMarket_user_detailAddress : haruMarket_user_detailAddress.value.value,
        haruMarket_user_birthday : join.haruMarket_user_birthday,
        haruMarket_user_gender : join.haruMarket_user_gender,
        haruMarket_user_name : join.haruMarket_user_name,
        haruMarket_user_phone : join.haruMarket_user_phone,
        haruMarket_user_uniqueKey : join.haruMarket_user_uniqueKey,
    }

    //var data = ajax_send(null,`https://back1.haru.company/common/join/${JSON.stringify(fdata)}`,"POST");
    const sendData = async () => {
        try {
            const response = await axios.post('https://back1.haru.company/common/join', JSON.stringify(fdata), {
            headers: {
                'Content-Type': 'application/json'
            }
            });
            console.log('응답 데이터:', response.data);

            router.replace({
                path: `/join4`,
                query: { t: Date.now() } // 강제 변경 감지
            });
        } catch (error) {
            console.error('에러 발생:', error);
            toastr.error("이미 존재하는 아이디입니다. 다른 아이디를 입력하여 주십시오.");
        }
    };
    sendData();
}
</script>
    
<template>
<div class="container-fluid ps-4 pt-5 pb-5" style='padding-right: 2.6rem !important;'>
    <div class="row">
        <div class="col-12 d-flex justify-content-center align-items-center" style="height: 80px;">
            <span class="display-5 text-dark fw-bold">
                JOIN
            </span>
        </div>
        <div class="col-12" style="height: 700px;">
            <div class="card h-100 w-100">
                <div class="card-header">
                    회원가입 (3/3) 회원정보 입력
                </div>
                <div class="card-body d-flex justify-content-center align-items-center">
                    <h5 class="card-title">
                        <label for="haruMarket_user_id" class="form-label">* 아이디</label>
                        <input type="text" ref="haruMarket_user_id" id="haruMarket_user_id" class="form-control" aria-describedby="haruMarket_user_id_msg">
                        <div id="haruMarket_user_id_msg" class="form-text mb-2">
                            영소문자 또는 숫자만 포함하여 4~20자(20자) 입력하여주십시오.
                        </div>
                        <label for="haruMarket_user_pw" class="form-label">* 비밀번호</label>
                        <input type="password" ref="haruMarket_user_pw" id="haruMarket_user_pw" class="form-control" aria-describedby="haruMarket_user_pw_msg">
                        <div id="haruMarket_user_pw_msg" class="form-text mb-2">
                            영소문자 또는 숫자만 포함하여 4~20자(20자) 입력하여주십시오.
                        </div>
                        <label for="haruMarket_user_pwCheck" class="form-label">* 비밀번호 확인</label>
                        <input type="password" ref="haruMarket_user_pwCheck" id="haruMarket_user_pwCheck" class="form-control" aria-describedby="haruMarket_user_pwCheck_msg">
                        <div id="haruMarket_user_pwCheck_msg" class="form-text mb-2">
                            입력하신 비밀번호를 한번 더 입력하여 주십시오.
                        </div>

                        <label class="form-label">* 주소</label>
                        <div id="haruMarket_user_address_msg" class="form-text mb-2">
                            우편번호를 클릭하여 주소를 입력하여 주십시오.
                        </div>
                        <div class="row g-3 align-items-center mb-1">
                            <div class="col-auto">
                                <input type="text" ref="haruMarket_user_postCode" id="haruMarket_user_postCode" class="form-control" placeholder="우편번호" disabled readonly>
                            </div>
                            <div class="col-auto">
                                <button type="button" class="btn btn-primary" @click="addressFind">우편번호</button>
                            </div>
                        </div>
                        <input type="text" ref="haruMarket_user_basicAddress" id="haruMarket_user_basicAddress" class="form-control mb-1" placeholder="기본 주소" disabled readonly>
                        <input type="text" ref="haruMarket_user_detailAddress" id="haruMarket_user_detailAddress" class="form-control" placeholder="상세 주소">
                    </h5>
                </div>
                <div class="card-footer">
                    <button type="button" class="btn btn-primary" @click="joinf">회원가입</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>