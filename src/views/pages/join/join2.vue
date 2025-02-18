<script setup>
import { onBeforeMount } from 'vue';
import { ajax_send } from '@/tool.js';
import { join } from '@/stores/join';
import { useRouter } from 'vue-router';
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

const identity = function(){
    var IMP = window.IMP; // 생략 가능
    IMP.init("imp43126142");

    // 본인인증
    IMP.certification({ // param
    pg:'inicis.{MIIiasTest}',
    merchant_uid: "harubarter "+getYmd10(), // 주문 번호 개인적으로 설정 가능 
    popup:false
    }, function (rsp) { // callback
        console.log(rsp);
        if (rsp.success) {
            var formData = new FormData();
            var data = ajax_send(formData,`https://back1.haru.company/common/join_informationExport/${JSON.stringify(rsp)}`,"GET");
            join.haruMarket_user_birthday = data.birthday;
            join.haruMarket_user_gender = data.gender;
            join.haruMarket_user_name = data.name;
            join.haruMarket_user_phone = data.phone;
            join.haruMarket_user_uniqueKey = data.unique_key;
            join.haruMarket_join_certification = true;

            router.replace({
                path: `/join3`,
                query: { t: Date.now() } // 강제 변경 감지
            });
        } else {
            // 인증 실패 시 로직
            toastr.error('인증을 실패하였습니다.');
        }
    });
}

const getYmd10 = function(){
    var d = new Date();
    return d.getFullYear() + "-" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "-" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString());
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
                    회원가입 (2/3) 본인인증
                </div>
                <div class="card-body d-flex justify-content-center align-items-center">
                    <h5 class="card-title">
                        <p class="fs-5 text-dark fw-bold">
                            회원가입을 위하여<br/>
                            아래의 본인인증하기 버튼을 눌러서<br/>
                            본인인증을 진행하여 주시기 바랍니다.
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