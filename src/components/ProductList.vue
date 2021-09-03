<template>
  <!-- Шаблон компонента (отдельно от JavaScript) -->
  <ul class="catalog__list">
    <!-- Вставляем компонент и с помощью директивы v-for перебираем товары
    (составляем список) из свойства products (из props) и записываем их
    в созданную переменную product.
    key - это уникальное значение (id продукта) для каждого элемента списка -->
    <ProductItem
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
  </ul>
</template>

<script>
import ProductItem from '@/components/ProductItem.vue';

export default {
  components: { ProductItem },
  props: { // Входные параметры:
    products: { // Назовём параметр "products"
      type: Array, // Тип параметра: Массив
      default: () => [], // Значение по умолчанию (пустой массив)
    },
  },
};
</script>
