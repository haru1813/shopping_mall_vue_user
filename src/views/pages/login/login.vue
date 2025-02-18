<script setup>
import { onBeforeMount,ref } from 'vue';
import { ajax_send } from '@/tool.js';
import axios from 'axios';
import { dataStore } from '@/stores/dataStore.js';
import { useRouter } from "vue-router";

const router = useRouter();
const dataStores = dataStore();
const haruMarket_user_id = ref(null);
const haruMarket_user_pw = ref(null);

onBeforeMount(() => {
    if(dataStores.authorization != ''){
        router.replace({
            path: `/`,
            query: { t: Date.now() } // 강제 변경 감지
        });
    }
});

const login = function(){
    
    if(haruMarket_user_id.value.value == ""){
        toastr.error('아이디를 입력하여 주십시오.');
        haruMarket_user_id.value.focus();
        return;
    }
    if(haruMarket_user_pw.value.value == ""){
        toastr.error('비밀번호를 입력하여 주십시오.');
        haruMarket_user_pw.value.focus();
        return;
    }

    const params = new URLSearchParams();
    params.append('haruMarket_user_id', haruMarket_user_id.value.value);
    params.append('haruMarket_user_pw', haruMarket_user_pw.value.value);

    axios.post('https://back1.haru.company/login', params, {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    })
    .then(response => {
        dataStores.authorization = response.headers.authorization;
        router.replace({
            path: `/`,
            query: { t: Date.now() } // 강제 변경 감지
        });
    })
    .catch(error => {
        toastr.error("로그인을 실패하였습니다.");
    });
}

const move = function(url){
  router.replace({
    path: url,
    query: { t: Date.now() } // 강제 변경 감지
  });
}
</script>
<template>
<div class="container-fluid ps-4 pt-5 pb-5" style='padding-right: 2.6rem !important;'>
    <div class="row">
        <div class="col-12 d-flex justify-content-center align-items-center" style="height: 80px;">
            <span class="display-5 text-dark fw-bold">
                LOGIN
            </span>
        </div>
        <div class="col-12" style="height: 700px;">
            <div class="card h-100 w-100">
                <div class="card-header">
                    로그인
                </div>
                <div class="card-body d-flex justify-content-center align-items-center">
                    <h5 class="card-title">
                        <label for="haruMarket_user_id" class="form-label">아이디</label>
                        <input type="text" ref="haruMarket_user_id" class="form-control mb-2">
                        <label for="haruMarket_user_pw" class="form-label">비밀번호</label>
                        <input type="password" ref="haruMarket_user_pw" class="form-control">
                    </h5>
                </div>
                <div class="card-footer">
                    <button type="button" class="btn btn-primary me-1" @click="login">로그인</button>
                    <button type="button" class="btn btn-primary me-1" @click="move('/join1')">회원가입</button>
                    <button type="button" class="btn btn-primary me-1" @click="move('/id_find')">아이디 찾기</button>
                    <button type="button" class="btn btn-primary me-1" @click="move('/pw_find')">비밀번호 찾기</button>
                </div>
            </div>
        </div>
    </div>
</div>    
</template>