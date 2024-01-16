import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Staking from '../views/Staking.vue';
import Swapping from '../views/Swapping.vue';
import Maze from '../views/Maze.vue';
import Collection from '../views/Collection.vue';
import Wallet from '../views/Wallet.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/staking',
    name: 'Staking',
    component: Staking,
  },
  {
    path: '/swapping',
    name: 'Swapping',
    component: Swapping,
  },
  {
    path: '/maze',
    name: 'Maze',
    component: Maze,
  },
  {
    path: '/collection',
    name: 'Collection',
    component: Collection,
  },
  {
    path: '/wallet',
    name: 'Wallet',
    component: Wallet,
  },
  // ...add other routes here
];

const router = createRouter({
  history: createWebHistory(), // This line enables HTML5 history mode and removes the hash from the URL.
routes,
});

export default router;

