<template>
    <aside :class="{ 'collapsed': mainStore.sidebarCollapsed }" class="sidebar">
        <div class="toggle-container">
            <img 
                :src="collapseIcon"
                @click="mainStore.sidebarToggle"
                class="toggle-icon"
                alt="Toggle Sidebar"
            />
        </div>
        <div class="side-content">
            <!-- Your sidebar links and text here -->
            <router-link to="/staking"><span role="img" aria-label="Staking">🌟</span> Staking</router-link>
            <router-link to="/swapping"><span role="img" aria-label="Swapping">💱</span> Swapping</router-link>
            <router-link to="/maze">Maze</router-link>
            <router-link to="/collection">Collection</router-link>
            <router-link to="/wallet">Wallet</router-link>
            <!-- ... other links -->
        </div>
    </aside>
</template>

<script setup>
import { ref } from 'vue';
import { useMainStore } from '@/stores/mainStore';
import collapseIcon from '@/assets/icons/collapse.svg';

const mainStore = useMainStore();
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.sidebar {
    z-index: 1;
    margin-top: 3rem !important;
    background: white;
    position: fixed;
    top: $navbar-height; // Adjust based on the actual height of your navbar
    bottom: 0;
    width: $sidebar-width; // Expanded width
    transition: width 0.3s;
    overflow-x: hidden;
    padding: 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin: 1rem;
    margin-left: 2rem;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center; // Centers children horizontally in the sidebar
    justify-content: center; // Centers children vertically in the sidebar

    .toggle-container {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem; // Positions the toggle icon at the top-right corner
    }
    .side-content {
        display: flex;
        flex-direction: column;

        .router-link {
            display: flex;
            align-items: center; // Aligns the emoji and text vertically
            margin-bottom: 0.5rem; // Space between links

            span {
                margin-right: 0.5rem; // Space between emoji and text
            }
        }
    }
    .toggle-icon {
        cursor: pointer; // Makes it clear that the image is clickable
        transition: transform 0.3s; // Smooth transition for the transform

        &:hover {
            opacity: 0.8; // Optional: change the opacity on hover for a visual effect
        }
    }
    &.collapsed {
        width: $collapsed-sidebar-width; // Collapsed width, e.g., 50px

        // Hide the content when collapsed
        .side-content {
        display: none;
        }
        .toggle-icon {
            transform: scaleX(-1); // Mirrors the image horizontally
        }

        // Adjust the padding or any other properties for the collapsed state
        padding: 0.5rem; // Reduced padding when collapsed
    }

    // Styles for the active link
    .router-link-active {
        font-weight: bold;
    }
}
</style>