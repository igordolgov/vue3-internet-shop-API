import { createStore } from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '../config';

// Создаём (и сразу экспортируем) хранилище. Доступ к хранилищу
// можно получить из любого компонента с помощью $store
export default createStore({
  state: { // Зададим состояние для хранения списка товаров
    cartProducts: [],
    userAccessKey: null, // свойство для хранения ключа пользователя (для Корзины)
    cartProductsData: [], // массив для хранения информации о Корзине (получаем из API)
    cartParams: {
      cartUpdate: false,
      cartUpdated: false,
    },
    productAddSending: false,
    loadingCart: true,
  },
  mutations: { // Мутации - единственный способ изменения состояния хранилища во Vuex.
    // Чтобы вызвать мутацию, необходимо вызвать $store.commit
    updateDelivery(state, delivery) {
      state.delivery = delivery;
    },
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },
    updateCartProductAmount(state, {
      productId,
      amount,
    }) {
      const item = state.cartProducts.find((el) => productId === el.productId);
      if (item) {
        item.amount = amount;
      } else {
        state.cartProducts.findIndex((el) => el.productId === productId);
      }
    },
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateCartProductsData(state, items) {
      state.cartProductsData = items;
    },
    updateCartError(state, data) {
      state.cartError = data;
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData.map((item) => ({
        productId: item.product.id,
        amount: item.quantity,
      }));
    },
  },
  getters: { // вычисляемые свойства хранилища.Геттеры доступны в объекте
    // store.getters, их можно легко использовать внутри любого компонента
    cartDetailProducts(state) { // Первым аргументом получаем состояние хранилища
      return state.cartProducts.map((item) => {
        const { product } = state.cartProductsData.find((p) => p.product.id === item.productId);
        return {
          ...item,
          product: {
            ...product,
            image: product.image.file.url,
          },
        };
      });
    },
    cartTotalPrice(state, getters) { // вторым аргументом можем указать другие геттеры
      return getters.cartDetailProducts
        .reduce((acc, item) => (item.product.price * item.amount) + acc, 0);
    },
    cartCountProducts(state, getters) {
      return getters.cartDetailProducts.reduce((acc, item) => (item.amount) + acc, 0);
    },
    deliveryCost(state, getters) {
      const cost = Math.ceil(getters.cartTotalPrice / 10000) * 100;
      return (cost > 0 && cost < 500) ? 500 : cost;
    },
  },
  actions: { // Действия — похожи на мутации с несколькими отличиями:
    // Вместо того, чтобы напрямую менять состояние, действия инициируют мутации;
    // Действия могут использоваться для асинхронных операций
    async loadOrderInfo(context, orderId) {
      const response = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        });
      context.commit('updateOrderInfo', response.data);
    },
    async loadCart(context) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/baskets`, {
            params: {
              userAccessKey: context.state.userAccessKey,
            }, // для передачи уникального ключа пользователя
            // при последующих запросах
          });
        if (!context.state.userAccessKey) { // Если это свойство в глобальном хранилище пустое,
          // то выполняем дальнейшие действия:
          localStorage.setItem('userAccessKey', response.data.user.accessKey); // Записываем

          // в localStorage ту же информацию, что в глобальное хранилище (для сохранения Корзины)
          context.commit('updateUserAccessKey', response.data.user.accessKey); // При

          // первом запросе запоминаем уникальный ключ пользователя
        }
        context.commit('updateCartProductsData', response.data.items);
        context.commit('syncCartProducts');
      } catch (e) {
        context.commit('updateCartProductsData', []);
        context.commit('updateCartError', true);
      }
    },
    async addProductToCart(context, {
      productId,
      amount,
    }) {
      await (new Promise((resolve) => setTimeout(resolve, 1500)));
      const response = await axios.post(`${API_BASE_URL}/api/baskets/products`, {
          productId,
          quantity: amount,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        });
      context.commit('updateCartProductsData', response.data.items);
      context.commit('syncCartProducts');
    },
    async updateCartProductAmount(context, {
      productId,
      amount,
    }) {
      context.commit('updateCartProductAmount', {
        productId,
        amount,
      });

      if (amount < 1) {
        return;
      }
      try {
        const response = await axios.put(`${API_BASE_URL}/api/baskets/products`, {
            productId,
            quantity: amount,
          }, {
            params: {
              userAccessKey: context.state.userAccessKey, // Передаём уникальный ключ пользователя
            },
          });
        context.commit('updateCartProductsData', response.data.items);
      } catch (e) {
        context.commit('syncCartProducts'); // Синхронизируем в случае ошибки
      }
    },
    async deleteCartProduct(context, { productId }) {
      const response = await axios.delete(`${API_BASE_URL}/api/baskets/products`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
          data: {
            productId,
          },
        });
      context.commit('updateCartProductsData', response.data.items);
      context.commit('syncCartProducts');
    },
  },
});
