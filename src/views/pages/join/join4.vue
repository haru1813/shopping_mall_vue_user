<script setup>
import { ajax_send } from '@/tool.js';
import { join } from '@/stores/join';
import { onBeforeMount } from 'vue';
import { useRouter } from "vue-router";
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
  if(!join.haruMarket_join_certification){
    router.replace({
        path: `/`,
        query: { t: Date.now() } // 강제 변경 감지
    });
  }
  join.haruMarket_join_certification = false;
});

const ok = function(){
    router.replace({
        path: `/`,
        query: { t: Date.now() } // 강제 변경 감지
    });
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
                    회원가입 완료
                </div>
                <div class="card-body d-flex justify-content-center align-items-center">
                    <h5 class="card-title">
                        <p class="fs-5 text-dark fw-bold">
                            반갑습니다. 회원가입이 완료 되었습니다.<br/>
                            저희 쇼핑몰을 이용해 주셔서 감사합니다.
                        </p>
                    </h5>
                </div>
                <div class="card-footer">
                    <button type="button" class="btn btn-primary" @click="ok">확인</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>