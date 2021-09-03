<template>
  <div
    class="form__counter"
  >
    <button
      type="button"
      aria-label="Убрать один товар"
      @click.prevent="counterChange(value - 1)"
    >
      <svg
        width="10"
        height="10"
        fill="currentColor"
      >
        <use xlink:href="#icon-minus" />
      </svg>
    </button>

    <input
      type="text"
      v-model.number="value"
      name="count"
      readonly
    >

    <button
      type="button"
      aria-label="Добавить один товар"
      @click.prevent="counterChange(value + 1)"
    >
      <svg
        width="10"
        height="10"
        fill="currentColor"
      >
        <use xlink:href="#icon-plus" />
      </svg>
    </button>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  // eslint-disable-next-line vue/require-prop-types
  props: ['modelValue', 'minValue'],
  methods: {
    counterChange(newCounter) {
      if (newCounter >= this.minValue) {
        this.$emit('update:modelValue', newCounter);
      }
    },
  },
  watch: {
    value(newVal) {
      this.counterChange(newVal);
    },
  },
});
</script>

<style>
  button {
    cursor: pointer;
}
</style>
