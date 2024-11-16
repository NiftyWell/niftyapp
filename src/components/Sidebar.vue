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
            <h3>Communifty tab</h3>
            <!-- 
            <router-link class="router-link" to="/wallet" active-class="router-link-active"><span role="img" aria-label="Wallet">👛</span>Wallet</router-link>
            -->
            <router-link class="router-link" to="/collection" active-class="router-link-active"><span role="img" aria-label="Collection">🃏</span>Collection</router-link>
            <router-link class="router-link" to="/staking" active-class="router-link-active"><span role="img" aria-label="Staking">🔒</span> Staking</router-link>
            <router-link class="router-link" to="/lab" active-class="router-link-active"><span role="img" aria-label="Lab">🧪</span> Lab</router-link>
            <router-link class="router-link router-maze" to="/maze" active-class="router-link-active">
                <img src="@/assets/images/maze/blocks/portal.gif" alt="Maze" />
                Maze
            </router-link>            
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
    top: $navbar-height - 20px;
    bottom: 0;
    width: $sidebar-width;
    transition: 0.3s;
    overflow-x: hidden;
    padding: 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin: 1rem;
    margin-left: 2rem;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .toggle-container {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem; 
    }
    .side-content {
        display: flex;
        flex-direction: column;
        margin-top: calc($navbar-height - 5rem);
        position: absolute;
        top: 3rem;
        .router-link {
            display: flex;
            align-items: center;
            margin-bottom: 0.5rem; // Space between links
            padding: 0.2rem; // Padding around links
            border-radius: 0.4rem;
            transition: transform 0.3s ease; // Smooth scaling transition

            &:hover, &.router-link-active {
                transform: scale(1.02); 
                box-shadow: rgba(0, 0, 0, 0.192) 0px 0px 10px 0px inset, rgba(0, 0, 0, 0.1) 0px 0px 0px 0px;
            }

            &:active {
                transform: scale(1);
            }


            span, img {
                margin-right: 0.5rem; // Space between emoji/image and text
            }

            img {
                max-width: 30px; // Set the maximum width of the image
                height: auto;
            }
        }

        a {
            text-decoration: none;
            color: inherit;
        }
    }
    .toggle-icon {
        cursor: pointer;
        transition: transform 0.3s;

        &:hover {
            opacity: 0.8;
        }
    }
    &.collapsed {
        width: $collapsed-sidebar-width;
        height: $collapsed-sidebar-heigth;
        .side-content {
            display: none;
        }
        .toggle-icon {
            transform: scaleX(-1);
        }

        padding: 0.5rem; 
    }

    .router-link-active {
        //font-weight: bold;
    }
}
</style>