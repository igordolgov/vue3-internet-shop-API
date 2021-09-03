<template>
  <li
    class="cart__item product"
  >
    <div class="product__pic">
      <img
        :src="item.product.image"
        width="120"
        height="120"
        :alt="item.product.title"
      >
    </div>
    <router-link
      :to="{
        name: 'product',
        params: {id: item.product.id}
      }"
    >
      <h3 class="product__title">
        {{ item.product.title }}
      </h3>
    </router-link>
    <span class="product__code">
      Артикул: {{ item.product.id }}
    </span>

    <ProductCounter
      class="product__counter form__counter"
      v-model="amount"
      :min-value="1"
    />
    <b class="product__price">
      {{ totalPricePretty }} ₽
    </b>

    <button
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
      @click.prevent="deleteProduct(item.productId)"
    >
      <svg
        width="20"
        height="20"
        fill="currentColor"
      >
        <use xlink:href="#icon-close" />
      </svg>
    </button>
  </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat'; // Форматирование цены
import { mapActions } from 'vuex';
import ProductCounter from '@/components/ProductCounter.vue';

export default {
  components: { ProductCounter },
  data() {
    return {};
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['item'],
  computed: {
    totalPricePretty() {
      return numberFormat(this.item.amount * this.item.product.price);
    },
    amount: {
      get() {
        return this.item.amount;
      },
      set(value) {
        this.$store.dispatch('updateCartProductAmount', {
          productId: this.item.productId,
          amount: value,
          color: this.item.color,
          // capacity: this.item.capacity,
        });
      },
    },
  },
  methods: {
    ...mapActions(['deleteCartProduct']),
    deleteProduct() {
      this.deleteCartProduct({
        productId: this.item.productId,
      });
    },
  },
};
</script>
