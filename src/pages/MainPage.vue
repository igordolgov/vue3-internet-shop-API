<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">
        Каталог
      </h1>
      <span class="content__info">
        152 товара
      </span>
    </div>

    <div class="content__catalog">
      <!-- Подключаем ProductFilter и передаём ему значения через пропсы (с помощью v-bind).
      * Про использование модификатора ".sync" см. в файле ProductFilter.vue-->
      <ProductFilter
        v-model:page="page"
        v-model:price-from="filterPriceFrom"
        v-model:price-to="filterPriceTo"
        v-model:category-id="filterCategoryId"
        v-model:color-id="filterColorsId"
      />

      <section class="catalog">
        <div
          v-if="productsLoading"
        >
          <!-- До загрузки товаров показываем это: -->
          Загрузка товаров...
        </div>
        <div
          v-if="productsLoadingFailed"
        >
          <!-- Если произошла ошибка загрузки товаров показываем это: -->
          Произошла ошибка при загрузке товаров!
          <button
            @click.prevent="loadProducts"
          >
            Попробовать ещё раз
          </button>
        </div>

        <!-- Подключаем компонент ProductList и передаем ему параметр products,
        который равен массиву products, хранящемуся в состоянии data (в computed)-->
        <ProductList
          :products="products"
          :filter-color="filterColorsId"
        />
        <!-- Подключаем компонент BasePagination.Из-за того, что нам надо
        связать только одно свойство ("page"), мы можем использовать директиву v-model.
        Параметры ("per-page") вызываются в cebab-case, хотя в самом компоненте они
        записаны в camelCase. -->
        <BasePagination
          v-model="page"
          :count="countProducts"
          :per-page="productsPerPage"
        />
      </section>
    </div>
  </main>
</template>

<script> // СЕКЦИЯ СКРИПТОВ -------------------------------------------------------
// Импортируем файлы и компоненты, которые понадобятся в этом файле (чтобы можно было
// подключать эти компоненты). "@" означает "абсолютный путь до папки src"
import axios from 'axios'; // Axios — это JavaScript-библиотека. Она представляет собой
// HTTP-клиент, основанный на промисах и предназначенный для браузеров и для Node.js
import ProductList from '@/components/ProductList.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import BasePagination from '@/components/BasePagination.vue';
import { API_BASE_URL } from '@/config';

export default {
  components: { ProductList, BasePagination, ProductFilter }, // Подключаемые компоненты
  // Так как Ключ (тэг в шаблоне) и Значение (сам Компонент) совпадают по названию,
  // используется сокращённая запись (одним словом, а не ProductList = ProductList)
  data() { // СОСТОЯНИЕ (В компоненте состояние должно быть функцией, а не объектом).
  // Если значения этих свойств изменятся, компонент перерисуется
    return { // Создаём (придумываем) свойства для хранения значений из полей ввода и др.
      filterPriceFrom: 0, // Начальная цена в фильтре (по умолчанию: 0)
      filterPriceTo: 0, // Конечная цена в фильтре (по умолчанию: 0)
      filterCategoryId: 0, // Категория (по умолчанию: "Все категории")
      filterColorsId: 0, // Фильтр по цвету (по умолчанию: "Без фильтра")
      page: 1, // Текущая страница (по умолчанию: первая)
      productsPerPage: 6, // Товаров на странице (по сколько показывать)
      productsData: null, // Хранилище ответов от сервера (по умолчанию: "null")
      categoriesData: 0,
      productsLoading: false, // Статус загрузки
      productsLoadingFailed: false, // Есть ли ошибки при загрузке
    };
  },
  computed: { // ВЫЧИСЛЯЕМЫЕ СВОЙСТВА:
  // Вычисляемые свойства - это свойства, значения которых получаются динамически, с помощью
  // функций, а результаты кэшируются до тех пор, пока зависимые свойства не будут изменены
  // (чтобы не пересчитывать значения каждый раз заново, если они не изменяются)
  // Внутри вычисляемых свойств могут быть другие вычисляемые свойства, пропсы...
    products() {
      return this.productsData // Если ProductsData есть, возвращаем список товаров:
        ? this.productsData.items.map((product) => {
          // Через функцию map преобразуем формат вывода картинок:
          // выводим тот же список, но картинку меняем и возвращаем с правильным путём
          const item = { ...product, image: product.image.file.url };
          return item;
        })
        : []; // Если ProductsData нет, возвращаем пустой массив
    },
    countProducts() { // Функция вывода общего количество товаров
      return this.productsData
        ? this.productsData.pagination.total
        : 0;
    },
  },
  methods: {
    loadProducts() { // Метод (функция) для загрузки данных с сервера
      this.productsLoading = true; // Для отображения сообщения о загрузке
      this.productsLoadingFailed = false; // НЕ отображать сообщение об ошибке загрузки
      clearTimeout(this.loadProductsTimer); // Очищаем таймер загрузки товаров
      this.loadProductsTimer = setTimeout(() => {
        axios
          .get((`${API_BASE_URL}/api/products`), {
            params: { // Параметры вывода списка товаров (что и как выводить)
            // Свойства берём из API, значения (данные) из Состояния приложения
              page: this.page,
              limit: this.productsPerPage,
              minPrice: this.filterPriceFrom,
              maxPrice: this.filterPriceTo,
              categoryId: this.filterCategoryId,
              colorId: this.filterColorsId,
            },
          })
          .then((response) => this.productsData = response.data) // При успешном ответе
        // запишем в переменную response свойство из состояния компонента productsData
          .catch(() => this.productsLoadingFailed = true) // Отлавливаем ошибки загрузки (сообщение)
          .then(() => this.productsLoading = false); // Убираем сообщение о загрузке
      }, 200); // Время таймера загрузки товаров (в миллисекундах)
    },
  },
  watch: { // НАБЛЮДАТЕЛИ. Если значение свойства изменилось вызывается функция
    page() {
      this.loadProducts();
    },
    filterPriceFrom() {
      this.loadProducts();
    },
    filterPriceTo() {
      this.loadProducts();
    },
    filterCategoryId() {
      this.loadProducts();
    },
    filterColorsId() {
      this.loadProducts();
    },
  },
  created() { // Хук для запуска функций в момент после создания компонента
    this.loadProducts();
  },
};
</script>
