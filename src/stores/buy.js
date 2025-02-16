import { ref } from 'vue';
import { defineStore } from 'pinia';

export const buy = defineStore('buy', () => {
    const harumarket_userBasket_indexs = ref([]);
    const harumarket_userBuy = ref([]);
    const haruMarket_buy_ready = ref(false);
  
    return { 
        harumarket_userBasket_indexs, 
        harumarket_userBuy,
        haruMarket_buy_ready,
    };
}, {
    persist: {
      enabled: false,
      storage: sessionStorage // 🔹 sessionStorage에 저장 (브라우저 종료 시 데이터 삭제)
    }
});