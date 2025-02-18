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
    }
}

onBeforeMount(async () => {
    window.scrollTo(0, 0);
    await init();
})

const validataTest = function(text){
    const regex = /^[a-z0-9]{1,20}$/;
    return regex.test(text);
}

const haruMarket_user_pw = ref(null);
const haruMarket_user_changePw1 = ref(null);
const haruMarket_user_changePw2 = ref(null);

const change2 = async function(){
    if(haruMarket_user_pw.value.value==""){
        toastr.error('비밀번호를 입력하여 주십시오.');
        haruMarket_user_pw.value.focus();
        return;
    }
    if(haruMarket_user_changePw1.value.value==""){
        toastr.error('비밀번호를 입력하여 주십시오.');
        haruMarket_user_changePw1.value.focus();
        return;
    }
    if(!validataTest(haruMarket_user_changePw1.value.value)){
        toastr.error('바꿀 비밀번호는 영소문자 또는 숫자만 포함하여 4~20자(20자) 입력하여주십시오.');
        haruMarket_user_changePw1.value.focus();
        return;
    }
    if(haruMarket_user_changePw1.value.value != haruMarket_user_changePw2.value.value){
        toastr.error('바꿀 비밀번호와 바꿀 비밀번호 확인 값이 서로 다릅니다.');
        haruMarket_user_changePw1.value.focus();
        return;
    }
    let reqData = {
        haruMarket_user_pw : requestData.value.haruMarket_user_pw,
        check_haruMarket_user_pw : haruMarket_user_pw.value.value,
        change_haruMarket_user_pw : haruMarket_user_changePw1.value.value
    }

    let responData = await httpRequest("POST","https://back1.haru.company/user/change2",reqData,dataStores.authorization);
    if(responData.status != 200){
        responData = await httpRequest("POST","https://back1.haru.company/common/token_refresh",null,dataStores.authorization);
        if(responData.status == 200){
            dataStores.authorization = responData.data.token;
            responData = await httpRequest("POST","https://back1.haru.company/user/change2",reqData,dataStores.authorization);
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

</script>
<template>
<div class="container-fluid ps-4 pt-5 pb-5" style='padding-right: 2.6rem !important;'>
    <div class="row">
        <div class="col-12 d-flex justify-content-center align-items-center" style="height: 80px;">
            <span class="display-5 text-dark fw-bold">
                비밀번호 변경
            </span>
        </div>
        <div class="col-12" style="height: 700px;">
            <div class="card h-100 w-100">
                <div class="card-header">
                    비밀번호 변경
                </div>
                <div class="card-body d-flex justify-content-center align-items-center">
                    <h5 class="card-title">
                        <label for="haruMarket_user_pw" class="form-label">현재 비밀번호</label>
                        <input type="password" ref="haruMarket_user_pw" class="form-control mb-2">
                        
                        <label for="haruMarket_user_changePw1" class="form-label">* 바꿀 비밀번호</label>
                        <input type="password" ref="haruMarket_user_changePw1" class="form-control" aria-describedby="haruMarket_user_changePw1_msg">
                        <div id="haruMarket_user_changePw1_msg" class="form-text mb-2">
                            영소문자 또는 숫자만 포함하여 4~20자(20자) 입력하여주십시오.
                        </div>
                        <label for="haruMarket_user_changePw2" class="form-label">* 바꿀 비밀번호 확인</label>
                        <input type="password" ref="haruMarket_user_changePw2" class="form-control" aria-describedby="haruMarket_user_changePw2_msg">
                        <div id="haruMarket_user_changePw2_msg" class="form-text mb-2">
                            입력하신 비밀번호를 한번 더 입력하여 주십시오.
                        </div>
                    </h5>
                </div>
                <div class="card-footer">
                    <button type="button" class="btn btn-primary" @click="change2">수정</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>