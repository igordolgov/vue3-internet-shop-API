<template>
  <BaseFormField
    :title="title"
    :error="error"
  >
    <input
      class="form__input"
      v-model="dataValue"
      :type="type"
      name="name"
      :placeholder="placeholder"
    >
  </BaseFormField>
</template>

<script>
import formFieldMixin from '@/mixins/formFieldMixin';
// import { set } from 'vue/types/umd';

export default {
  props: {
    // eslint-disable-next-line vue/require-prop-types
    type: { // Для того, чтобы менять тип поля ввода
      default: 'text',
    },
  },
  // Миксины позволяют инкапсулировать одну функциональность,
  // чтобы можно было использовать её в разных компонентах.
  mixins: [formFieldMixin], // см. файл formFieldMixin
};
</script>

<style>
</style>
