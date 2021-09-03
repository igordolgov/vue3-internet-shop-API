import { createRouter, createWebHashHistory } from 'vue-router';
import MainPage from '@/pages/MainPage.vue';
import ProductPage from '@/pages/ProductPage.vue';
import CartPage from '@/pages/CartPage.vue';
import OrderPage from '@/pages/OrderPage.vue';
import OrderInfoPage from '@/pages/OrderInfoPage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';
import config from '../../vue.config'

const routes = [ // Добавляем маршруты
  { name: 'main', component: MainPage, path: '/' },
  { name: 'product', component: ProductPage, path: '/product/:id' },
  { name: 'cart', component: CartPage, path: '/cart' },
  { name: 'order', component: OrderPage, path: '/order' },
  { name: 'orderInfo', component: OrderInfoPage, path: '/order/:id' },
  { name: 'notFound', component: NotFoundPage, path: '/:pathMatch(.*)*' },
];

const router = createRouter({ // В роутер надо передать тип того,
  // как строится история: "createWebHashHistory"
  history: createWebHashHistory(config.publicPath), // параметром передаём путь,
  // от которого будут строиться url при публикации: "config.publicPath"
  routes, // Подключаем массив маршрутов
}); // Создаём новый экземпляр VueRouter

export default router; // Экспортируем VueRouter
