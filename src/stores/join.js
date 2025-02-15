import { ref } from 'vue';
import { defineStore } from 'pinia';

export const join = defineStore('join', () => {
    const haruMarket_user_birthday = ref("");
    const haruMarket_user_gender = ref("");
    const haruMarket_user_name = ref("");
    const haruMarket_user_phone = ref("");
    const haruMarket_user_uniqueKey = ref("");
    const haruMarket_join_certification = ref(false);
  
    return { 
        haruMarket_user_birthday, 
        haruMarket_user_gender,
        haruMarket_user_name,
        haruMarket_user_phone,
        haruMarket_user_uniqueKey,
        haruMarket_join_certification,
    };
}, {
    persist: {
      enabled: false,
      storage: sessionStorage // 🔹 sessionStorage에 저장 (브라우저 종료 시 데이터 삭제)
    }
});