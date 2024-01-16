// src/stores/mainStore.ts
import { defineStore } from 'pinia';
import { ref } from "vue";

export const useMainStore = defineStore('mainStore', () => {
    const sidebarCollapsed = ref(false);

    function sidebarToggle() {
        sidebarCollapsed.value = !sidebarCollapsed.value;
        console.log("sidebarCollapsed", sidebarCollapsed.value);
    };

    return {
        // refs
        sidebarCollapsed,
        // functions
        sidebarToggle
    };
});
