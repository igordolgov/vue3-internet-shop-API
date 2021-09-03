<template>
  <!-- <router-link> — компонент предназначенный для навигации пользователя в приложении
  с клиентской маршрутизацией. Путь назначения указывается входным параметром to -->
  <router-link
    class="header__cart"
    aria-label="Корзина с товарами"
    :to="{name: 'cart'}"
  >
    <svg
      width="30"
      height="21"
      fill="currentColor"
    >
      <use xlink:href="#icon-cart" />
    </svg>
    <span
      class="header__count"
      aria-label="Количество товаров"
    >
      {{ $store.state.cartProducts.length }}
    </span>
  </router-link>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CartIndicator',
  computed: {
    ...mapGetters({
      countProducts: 'cartCountProducts',
    }),
  },
};
</script>
