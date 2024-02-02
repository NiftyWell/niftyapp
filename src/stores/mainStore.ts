// src/stores/mainStore.ts
import { defineStore } from 'pinia';
import { ref } from "vue";

export const useMainStore = defineStore('mainStore', () => {
    const ticker = ref({
        rex: 'NIFTYREX-d8c812',
        tales: 'NFTTALES-636b0e',
        token: 'NFTBIT-6b732e',
        puzzle: 'NFTPUZZLES-290ada',
      });

    const sidebarCollapsed = ref(false);

    function sidebarToggle() {
        sidebarCollapsed.value = !sidebarCollapsed.value;
        console.log("sidebarCollapsed", sidebarCollapsed.value);
    };

    return {
        // refs
        sidebarCollapsed,
        ticker,
        // functions
        sidebarToggle
    };
});
