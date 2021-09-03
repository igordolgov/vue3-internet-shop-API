<template>
  <main
    class="content container"
    v-if="orderInfoLoading"
  >
    <h2 class="order__info-title">
      Информация о Вашем заказе загружается...<br>Подождите, пожалуйста.
    </h2>
  </main>
  <main
    class="content container"
    v-else
  >
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link
            class="breadcrumbs__link"
            :to="{ name: 'main' }"
          >
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link
            class="breadcrumbs__link"
            :to="{ name: 'cart' }"
          >
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> Оформление заказа </a>
        </li>
      </ul>

      <h1 class="content__title">
        Заказ оформлен <span>№ {{ order.id }}</span>
      </h1>
    </div>

    <section class="cart">
      <form
        class="cart__form form"
        action="#"
        method="POST"
      >
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет
            письмо с&nbsp;деталями заказа. Наши менеджеры свяжутся с&nbsp;Вами
            в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
              <span class="dictionary__value">
                {{ order.name }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span class="dictionary__value">
                {{ order.address }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key"> Телефон </span>
              <span class="dictionary__value">
                {{ order.phone }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
              <span class="dictionary__value">
                {{ order.email }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                картой при получении
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Комментарий к заказу
              </span>
              <span class="dictionary__value">
                {{ order.comment }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Текущий статус заказа
              </span>
              <span class="dictionary__value">
                {{ order.status ? order.status.title : '' }}
              </span>
            </li>
          </ul>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <OrderItem
              v-for="item in products"
              :key="item.id"
              :title="item.product.title"
              :price="item.product.price"
              :amount="item.quantity"
              :id="item.product.id"
            />
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>500 ₽</b></p>
            <p>
              Итого товаров: <b>{{ products.length }}</b> на сумму
              <b>{{ order.totalPrice }} ₽</b>
            </p>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import OrderItem from '@/components/OrderItem.vue';
// import numberFormat from '@/helpers/numberFormat';

export default {
  data() {
    return {
      order: {},
      products: [],
      orderInfoLoading: false,
    };
  },
  components: {
    OrderItem,
  },
  created() {
    if (
      this.$store.state.orderInfo &&
      this.$store.state.orderInfo.id === this.$route.params.id
    ) {
      this.order = this.$store.state.orderInfo;
      this.products = this.$store.state.orderInfo.basket.items;
      return;
    }
    this.orderInfoLoading = true;
    clearTimeout(this.orderInfoTimer);
    this.$store.dispatch('loadOrderInfo', this.$route.params.id).then(() => {
      this.orderInfoTimer = setTimeout(() => {
        this.order = this.$store.state.orderInfo;
        this.products = this.$store.state.orderInfo.basket.items;
        this.orderInfoLoading = false;
      }, 1500);
    });
  },
};
</script>

<style scoped>
.order__info-title {
  position: relative;
  padding-bottom: 75px;
  text-align: center;
}
.order__info-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 50px;
  height: 50px;
  transform: translateX(-50%);
  background-color: transparent;
  background-image: url('../assets/preloader.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
</style>
