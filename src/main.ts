import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import './assets/scss/main.scss'; // Importing global SCSS
const app = createApp(App).use(router); // Use the router
const pinia = createPinia();
app.use(pinia);

app.mount('#app');