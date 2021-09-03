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
          name="pay"
          :value="'card'"
          v-model="typeOfPayment"
          @change="$emit('update:paymentOption', typeOfPayment)"
        >
        <span class="options__value">Картой при получении</span>
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
          name="pay"
          :value="'cash'"
          v-model="typeOfPayment"
          @change="$emit('update:paymentOption', typeOfPayment)"
        >
        <span class="options__value">Наличными при получении</span>
      </label>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      typeOfPayment: this.paymentOption || 0,
    };
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['paymentOption'],
};
</script>

<style>
.options__label--loading {
  position: relative;
  overflow: hidden;
}
.options__label--loading::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #c1c1c1;
  z-index: 1;
  cursor: auto;
}
.options__label--loading::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, transparent, #d7d7d7, transparent);
  transform: translateX(-100%);
  animation: loading 1s infinite;
  z-index: 2;
}
@keyframes loading {
  100% {
    transform: translateX(100%);
  }
}
</style>
