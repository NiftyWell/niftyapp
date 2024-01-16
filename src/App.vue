<template>
  <div class="app">
    <Navbar />
    <Sidebar />
    <div class="content" :class="{ 'expanded': !mainStore.sidebarCollapsed, 'collapsed': mainStore.sidebarCollapsed }">
      <router-view/>
    </div>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import { useMainStore} from '@/stores/mainStore';
const mainStore = useMainStore();
</script>

<style lang="scss">
@import "@/assets/scss/variables";

.app {
  z-index: 1;
  display: flex;
  min-height: 100vh;

  .content {
    position: fixed;
    top: calc($navbar-height + 52px); // Adjust as needed
    right: 2rem;
    bottom: 1rem;
    left: calc(#{$sidebar-width} + 5rem); // Default position (sidebar expanded)
    z-index: 2;
    padding: 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background: white;
    border-radius: 1rem;
    transition: left 0.3s;

    &.expanded {
      left: calc(#{$sidebar-width} + 5rem); // Expanded state
    }

    &.collapsed {
      left: calc(#{$collapsed-sidebar-width} + 4rem); // Collapsed state
    }
  }
}
</style>
