<template>
    <nav class="navbar">
      <router-link to="/">Home</router-link>
      <router-link to="/community">Community</router-link>
      <router-link to="/docs">Docs</router-link>
      <router-link to="/connect">Connect</router-link>
    </nav>
</template>

<script setup>
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.navbar {
    background-color: $nifty-green;
    padding: 1rem;
    height: $navbar-height;
    padding-bottom: 60px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    width: 100%;
    top: 0;
    background: $nifty-green;
    z-index: 0; // Ensure the navbar is above other content
}


.router-link-active {
    font-weight: bold;
}
</style>
  