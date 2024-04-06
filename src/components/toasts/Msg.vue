<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/userStore";

const store = useUserStore();
const info = storeToRefs(store);
</script>
<template>
  <h5 class="toast-title">{{ info.toast_info.value.title }}</h5>
  <p class="toast-content">{{ info.toast_info.value.message }}</p>
  <a
    v-if="info.toast_info.value.link"
    class="toast-link"
    :href="info.toast_info.value.link"
    :target="'blank'"
    >Open transaction in explorer:</a
  >
</template>

<style scoped>
.toast-container {
  background: white !important;
  color: none;
}
.toast-title {
  color: black;
  font-family: "NiftyFont";
}
.toast-content {
  font-size: 14px;
  margin: 0;
  padding: 0;
  color: black;
  font-family: "NiftyFont";
}
.toast-title {
  margin-bottom: 2px;
  padding: 0;
  font-family: "NiftyFont";
}
.toast-link {
  font-family: "NiftyFont";
  text-decoration: none;
  color: #929292;
  font-size: 14px !important;
}
.toast-link::after {
  content: url("@/assets/icons/external_link.svg");
  background-size: 125px 125px;
  margin-left: 10px;
  margin-bottom: -10px;
  color: rgb(153, 153, 153);
}
</style>