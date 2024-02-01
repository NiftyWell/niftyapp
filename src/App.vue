<template>
  <div class="app">
    <Navbar />
    <Sidebar />
    <div class="content" :class="{ 'expanded': !mainStore.sidebarCollapsed, 'collapsed': mainStore.sidebarCollapsed }">
      <div class="content-container">
        <router-view />
      </div>
    </div>
  </div>
</template>


<script setup>
import { onMounted, onBeforeMount, watch} from "vue";
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import { useMainStore} from '@/stores/mainStore';
import { useUserStore} from '@/stores/userStore';
import { useVueErd } from 'vue-mvx';
const { account, erd, fetchAccount } = useVueErd();

const mainStore = useMainStore();
const userStore = useUserStore();
onBeforeMount(async () => {
  await userStore.loadWalletNfts(); // Load wallet NFTs when the app is mounted
});

watch(account, async () => {
  if (account.logged()) {
    await userStore.loadWalletNfts(); // Load wallet NFTs when the app is mounted
  } else {
    userStore.clearWallet();
  }
});
</script>

<style lang="scss">
@import "@/assets/scss/variables";

.app {
  z-index: 1;
  display: flex;
  min-height: 100vh;

  .content {
    position: fixed;
    top: calc($navbar-height + 52px); 
    right: 2rem;
    bottom: 1rem;
    left: calc(#{$sidebar-width} + 5rem); 
    z-index: 2;
    padding: 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background: white;
    border-radius: 1rem;
    transition: left 0.3s;

    &.expanded {
      left: calc(#{$sidebar-width} + 5rem); 
    }

    &.collapsed {
      left: calc(#{$collapsed-sidebar-width} + 4rem); 
    }
  }

  .content-container {
    border-radius: 1rem; 
    overflow: auto; 
    height: 100%; 
  }
}
</style>