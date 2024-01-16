<template>
    <nav class="navbar">
        <router-link to="/">
            <img src="@/assets/images/logo/logo.svg" alt="Logo" class="logo" />
        </router-link>
        <div class="link-group">
            <router-link to="/" class="router-link" active-class="router-link-active">Home</router-link>
            <router-link to="/community" class="router-link" active-class="router-link-active">Community</router-link>
            <router-link to="/docs" class="router-link" active-class="router-link-active">Docs</router-link>
        </div>
        <button v-if="$erdAccount.address" @click="logOut()" class="connect-button">{{$erdAccount.obfuscatedAddress()}}</button>
        <button v-else @click="show = true" class="connect-button">CONNECT</button>

    </nav>
    <transition name="fade">
        <div v-if="show" class="modalShadow" @click.self="show = false">
        <div class="modalContent">
            <div class="modalLogin" @click.stop>
                <div class="modalHeader">
                <div class="closeButton" @click="show = false">
                    <img src="@/assets/icons/close.svg" alt="Close" />
                </div>
                </div>
                <VueErdjsConnect
                :qrcodeHandler="qrcodeHandler"
                @click="clickOnWalletConnect"
                />
            </div>
        </div>
        </div>
    </transition>
</template>


<script setup>
import { VueErdjsConnect } from "vue-mvx";
import { sleep } from "@/utils/utils";
import { useVueErd } from "vue-mvx";
import { onMounted, ref, onBeforeMount, watch } from "vue";
import CustomQRCodeHandler from "@/utils/CustomQRCodeHandler";
import "@/assets/scss/login.scss";

const qrcodeHandler = new CustomQRCodeHandler();
const { account, erd } = useVueErd();
const show = ref(false);

const clickOnWalletConnect = () => {
  setTimeout(() => {
    const linkWrapperElAlreadyAppenned = document.querySelector(
      ".vue3rdj5__modes-open__btn-login-maiar-wrapper"
    );
    if (linkWrapperElAlreadyAppenned) return;
    const qrCodeEl = document.querySelector(".vue3rdj5__mode-qr");
    if (!qrCodeEl) return;
    const qrCodeContent = qrCodeEl["data-qrCode-data"];
    if (!qrCodeContent) return;
    const baseUrl =
      "https://maiar.page.link/?apn=com.elrond.maiar.wallet&isi=1519405832&ibi=com.elrond.maiar.wallet&link=https://maiar.com/?wallet-connect=";
    const maiarAppLink = baseUrl + encodeURIComponent(qrCodeContent);
    const linkEl = document.createElement("a");
    linkEl.href = maiarAppLink;
    linkEl.innerText = "Maiar login";
    linkEl.target = "_blank";
    const linkWrapperEl = document.createElement("div");
    linkWrapperEl.classList.add(
      "vue3rdj5__modes-open__btn-login-maiar-wrapper"
    );
    linkWrapperEl.appendChild(linkEl);
    const parentEl = qrCodeEl.parentElement;
    parentEl.appendChild(linkWrapperEl);
  }, 200);
};

watch([show, account], ([newShow, newAccount]) => {
  if (newShow && newAccount && newAccount.logged()) {
    show.value = false;
  }
});

onMounted(async () => {
  if (account.logged() && show) {
    show.value = false;
  }
});

onBeforeMount(async () => {
  if (account.logged() && show) {
    show.value = false;
  }
  let waiting = 5;
  while (!account.logged() && waiting != 0) {
    //account.value = await fetchAccount();
    await sleep(500);
    waiting -= 0.5;
  }
});

function logOut() {
  if (account.logged() && show) {
    return erd.logout();
  }
}
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

    .modalShadow {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modalContent {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
}
</style>
  