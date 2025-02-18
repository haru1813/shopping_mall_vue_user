<script setup>
import { onBeforeMount,ref } from 'vue';
import { useRouter } from 'vue-router';
import { dataStore } from '@/stores/dataStore.js';
import { sendData,getYmd10 } from '@/tool.js';

const router = useRouter();
const dataStores = dataStore();
const haruMarket_user_id = ref(null);
const msg = ref(null);

onBeforeMount(() => {
    if(dataStores.authorization != ''){
        router.replace({
            path: `/`,
            query: { t: Date.now() } // 강제 변경 감지
        });
    }
});

const identity = function(){
    if(haruMarket_user_id.value.value == ""){
        toastr.error('아이디를 입력하여 주십시오.');
        haruMarket_user_id.value.focus();
        return;
    }

    var IMP = window.IMP; // 생략 가능
    IMP.init("imp43126142");

    // 본인인증
    IMP.certification({ // param
        pg:'inicis.{MIIiasTest}',
        merchant_uid: "harubarter "+getYmd10(), // 주문 번호 개인적으로 설정 가능 
        popup:false
    }, async function (rsp) { // callback
        console.log(rsp);
        if (rsp.success) {
            rsp.haruMarket_user_id = haruMarket_user_id.value.value;

            let data = await sendData('https://back1.haru.company/common/pw_find',rsp,'post');
            if(data.status ==400){
                msg.value="아직 회원가입을 진행하지 않으시거나<br/>아이디를 잘못 입력하셨습니다.";
            }
            else{
                msg.value=`고객님의 임시 비밀번호는 ${data.data.haruMarket_user_pw} 입니다.`;
            }
        } else {
            // 인증 실패 시 로직
            toastr.error('인증을 실패하였습니다.');
        }
    });
}

</script>

<template>
<div class="container-fluid ps-4 pt-5 pb-5" style='padding-right: 2.6rem !important;'>
    <div class="row">
        <div class="col-12 d-flex justify-content-center align-items-center" style="height: 80px;">
            <span class="display-5 text-dark fw-bold">
                FIND PASSWARD
            </span>
        </div>
        <div class="col-12" style="height: 700px;">
            <div class="card h-100 w-100">
                <div class="card-header">
                    비밀번호 찾기
                </div>
                <div class="card-body d-flex justify-content-center align-items-center">
                    <h5 class="card-title">
                    <label for="haruMarket_user_id" class="form-label">아이디</label>
                    <input type="text" ref="haruMarket_user_id" class="form-control mb-3">
                        <p class="fs-5 text-dark fw-bold">
                            비밀번호를 찾기 위하여 아이디를 입력 후<br/>
                            아래의 본인인증하기 버튼을 눌러서<br/>
                            본인인증을 진행하여 주시기 바랍니다.
                        </p>
                        <p class="fs-5 text-danger fw-bold" v-html="msg">
                        </p>
                    </h5>
                </div>
                <div class="card-footer">
                    <button type="button" class="btn btn-primary" @click="identity">본인인증 하기</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>