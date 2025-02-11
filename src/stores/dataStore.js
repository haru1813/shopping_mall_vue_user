import { ref } from 'vue';
import { defineStore } from 'pinia';

export const dataStore = defineStore('dataStore', () => {
    const haruMarket_productCategory_index = ref(0);
    const harumarket_product_index = ref(0);
  
    return { haruMarket_productCategory_index, harumarket_product_index };
  }, {
    persist: {
      enabled: true,
      storage: sessionStorage // 🔹 sessionStorage에 저장 (브라우저 종료 시 데이터 삭제)
    }
  });
  
