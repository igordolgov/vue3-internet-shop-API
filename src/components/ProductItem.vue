<template>
  <li class="catalog__item">
    <!-- <router-link> — компонент предназначенный для навигации пользователя в приложении
    с клиентской маршрутизацией. Путь назначения указывается входным параметром to -->
    <router-link
      class="catalog__pic"
      :to="{name: 'product', params: {id: product.id}}"
    >
      <!-- подключаем картинку товара и с помощью директивы
      v-bind (сокращённо :) связываем её src и alt с товаром -->
      <img
        :src="product.image"
        :alt="product.title"
      >
    </router-link>

    <h3 class="catalog__title">
      <a href="#">
        {{ product.title }} <!-- С помощью интерполяции выводим название товара -->
      </a>
    </h3>

    <span class="catalog__price">
      <!-- С помощью интерполяции выводим цену товара -->
      {{ pricePretty }} &#8381;
    </span>

    <ColorsList
      class="colors--black"
      :colors="colors"
      :current-color="firstColor"
    />
  </li>
</template>

<script>
import ColorsList from '@/components/ColorsList.vue';
import gotoPage from '@/helpers/gotoPage';
import numberFormat from '@/helpers/numberFormat';

export default {
  components: {
    ColorsList,
  },
  props: {
    product: {
      type: Object,
      default: null,
    },
  },
  computed: {
    pricePretty() {
      return numberFormat(this.product.price);
    },
    colors() {
      return this.product.colors;
    },
    firstColor() {
      return this.colors[0].id;
    },
  },
  methods: {
    gotoPage,
  },
};
</script>
