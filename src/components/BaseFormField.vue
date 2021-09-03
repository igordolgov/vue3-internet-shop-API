<template>
  <label class="form__label">
    <!-- При отрисовке компонента <slot></slot> будет заменён на «Ваш профиль».
    Слоты могут содержать любой код шаблона, в том числе HTML и другие компоненты -->
    <slot />
    <span class="form__value">{{ title }}</span>
    <span
      class="form__error"
      v-if="error"
    >
      {{ error }}
    </span>
  </label>
</template>

<script>
export default {
  /* eslint-disable vue/require-prop-types */
  props: ['title', 'error'],
};
</script>

<style>
</style>
