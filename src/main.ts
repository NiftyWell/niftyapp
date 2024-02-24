import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { ElrondEnvEnum, providersOptions, initVueErdJsPlugin } from "vue-mvx";
import VueLazyload from 'vue3-lazyload';
import Rex from './assets/images/rex.png';
import RexBlur from './assets/images/rex-blur.png';
import './assets/scss/main.scss'; // Importing global SCSS
import './assets/fonts/fonts.css';
const app = createApp(App);
const pinia = createPinia();

initVueErdJsPlugin(
  providersOptions(ElrondEnvEnum.MAINNET, "8ac5785493fb6bf89165bf69e5703883")
).then((vueErdJsPlugin) => {
  app.use(vueErdJsPlugin);
  app.use(router);
  app.use(pinia);
  app.use(VueLazyload, {
    loading: RexBlur, // Placeholder image
    error: Rex, // Error image
  });
  app.mount('#app');
});
