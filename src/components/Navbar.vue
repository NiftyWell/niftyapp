<template>
    <nav class="navbar">
        <img src="@/assets/images/logo/logo.svg" alt="Logo" class="logo" />
        <div class="link-group">
            <router-link to="/" class="router-link" active-class="router-link-active">Home</router-link>
            <router-link to="/community" class="router-link" active-class="router-link-active">Community</router-link>
            <router-link to="/docs" class="router-link" active-class="router-link-active">Docs</router-link>
        </div>
        <router-link class="connect-button" to="/connect">Connect</router-link>
    </nav>
</template>


<script setup>
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";
@import "@/assets/scss/main";
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
    display: flex;
    align-items: center;
    justify-content: flex-start; // Align items to start of navbar
    font-family: "NiftyFont", Helvetica, Arial;
    font-size: 30px;
    a {
        text-decoration: none;
        color: inherit;
    }

    .logo {
        margin: 0rem 2rem; // 2rem margin to the right of the logo
        
    }

    .link-group {
        display: flex;
        align-items: center;
        gap: 2rem;
        margin-left: 3rem;

        .router-link {
            font-size: 30px;
            text-decoration: none;
            color: inherit;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border-radius: 0.7rem;
                padding: 0.4rem;
            &:hover, &.router-link-active {
                transform: scale(1.02); // Scale up link on hover and when active
                box-shadow: rgba(0, 0, 0, 0.192) 0px 0px 10px 0px inset, rgba(0, 0, 0, 0.1) 0px 0px 0px 0px;
                
            }
        }
    }
    .connect-button {
        @extend .button-white; // Extend the golden button style with optional flag
        // Additional styling specific to the navbar
        text-decoration: none; // Remove underline from link
        margin: 1rem 6rem 1rem auto;
        display: inline-block; // Align properly with other nav items
    }



    .router-link-active {
        font-weight: normal;
    }
}
</style>
  