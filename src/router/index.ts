import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Staking from '../views/Staking.vue';
import Lab from '../views/Lab.vue';
import Maze from '../views/Maze.vue';
import Collection from '../views/Collection.vue';
import Wallet from '../views/Wallet.vue';
import Docs from '../views/Docs.vue';
import Community from '../views/Community.vue';
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
    path: '/lab',
    name: 'Lab',
    component: Lab,
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
  {
    path: '/docs',
    name: 'docs',
    component: Docs,
  },
  {
    path: '/community',
    name: 'Community',
    component: Community,
  },
  // ...add other routes here
];

const router = createRouter({
  history: createWebHistory(), // This line enables HTML5 history mode and removes the hash from the URL.
routes,
});

export default router;

