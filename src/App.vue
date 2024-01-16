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
    z-index: 2;
    flex: 1;
    transition: margin-left 0.3s;
    margin: 9.25rem 2rem 1rem 1rem; // Top, Right, Bottom, Left margins
    padding: 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    top: $navbar-height; // Adjust based on the actual height of your navbar
    background: white;
    border-radius: 1rem;
    &.expanded {
      margin-left: calc(#{$sidebar-width} + 5rem); // Set the margin-left equal to the expanded width of the sidebar
    }

    &.collapsed {
      margin-left: calc(#{$collapsed-sidebar-width} + 4rem); // When collapsed, set margin-left to collapsed width
    }
  }
}
</style>
