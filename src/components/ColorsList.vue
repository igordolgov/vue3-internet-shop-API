<template>
  <ul class="colors">
    <li
      class="colors__item"
      v-for="color in colors"
      :key="color.id"
    >
      <label class="colors__label">
        <input
          class="colors__radio sr-only"
          type="radio"
          :name="'colors#'"
          :value="color.code"
        >
        <span
          class="colors__value"
          :style="'background-color:' + color.code"
        />
      </label>
    </li>
  </ul>
</template>

<script>
export default {
  props: [
  /* eslint-disable vue/require-prop-types */
    'colors',
    'currentColor',
    'elementName',
  ],
  computed: {
    currentColorComponent: {
      get() {
        return this.currentColor;
      },
      set(value) {
        this.$emit('update:currentColor', value);
      },
    },
  },
};
</script>

<style>
 .colors__value {
   border: 1px solid #444;
 }
</style>
