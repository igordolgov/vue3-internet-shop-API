<template>
  <ul class="cart__options options">
    <li class="options__item">
      <label
        class="options__label"
        :class="{
          'options__label--loading': this.$store.state.cartParams.cartUpdate,
        }"
      >
        <input
          class="options__radio sr-only"
          type="radio"
          name="delivery"
          :value="'free'"
          v-model="deliveryPrice"
          @change="$emit('update:deliveryOption', deliveryPrice)"
        >
        <span class="options__value">
          Самовывоз <b>&lpar;бесплатно&rpar;</b>
        </span>
      </label>
    </li>
    <li class="options__item">
      <label
        class="options__label"
        :class="{
          'options__label--loading': this.$store.state.cartParams.cartUpdate,
        }"
      >
        <input
          class="options__radio sr-only"
          type="radio"
          name="delivery"
          :value="deliveryCost"
          v-model="deliveryPrice"
          @change="$emit('update:deliveryOption', deliveryPrice)"
        >
        <span
          class="options__value"
        >
          Курьером
          <span
            :class="
              ('courier__delivery-price',
              {
                'courier__delivery-price--loading':
                  !this.$store.state.cartParams.cartUpdated,
              })
            "
          ><b
            v-show="this.$store.state.cartParams.cartUpdated"
          >&lpar;{{ deliveryCost }} ₽&rpar;</b>
          </span>
        </span>
      </label>
    </li>
  </ul>
</template>

<script>
// import numberFormat from '@/helpers/numberFormat';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      deliveryPrice: this.deliveryOption || 0,
    };
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['deliveryOption'],
  // filters: {
  //   numberFormat,
  // },
  computed: {
    ...mapGetters({
      deliveryCost: 'deliveryCost',
    }),
  },
};
</script>

<style>
.courier__delivery-price {
  position: relative;
}
.courier__delivery-price--loading::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 35px;
  width: 30px;
  height: 30px;
  transform: translateY(-50%);
  background-color: transparent;
  /* background-image: url('../assets/preloader.svg'); */
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
</style>
