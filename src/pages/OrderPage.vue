<template>
  <main class="content container">
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
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Корзина
      </h1>
      <span class="content__info">
        Товаров для оформления: {{ $store.state.cartProducts.length }}
      </span>
    </div>

    <section class="cart">
      <form
        class="cart__form form"
        action="#"
        method="POST"
        @submit.prevent="order"
      >
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText
              v-model="formData.name"
              :error="formError.name"
              title="ФИО"
              placeholder="Введите ваше полное имя"
            />

            <BaseFormText
              v-model="formData.address"
              :error="formError.address"
              title="Адрес доставки"
              placeholder="Введите ваш адрес"
            />

            <BaseFormText
              v-model="formData.phone"
              :error="formError.phone"
              type="tel"
              title="Телефон"
              placeholder="Введите ваш телефон"
            />

            <BaseFormText
              v-model="formData.email"
              :error="formError.email"
              type="email"
              title="Email"
              placeholder="Введите ваш Email"
            />

            <BaseFormTextarea
              title="Комментарий к заказу"
              v-model="formData.comment"
              :error="formError.comment"
              placeholder="Ваши пожелания"
            />
          </div>

          <div class="cart__options">
            <h3 class="cart__title">
              Доставка
            </h3>
            <CartOptionsDelivery
              v-model:delivery-option="deliveryPrice"
            />
            <h3 class="cart__title">
              Оплата
            </h3>
            <CartOptionsPayment v-model:payment-option="paymentType" />
          </div>
        </div>

        <div class="cart__block">
          <h2
            class="cart__block--descr cart__block--descr-loading"
            v-show="this.$store.state.cartParams.cartUpdate"
          >
            Загрузка товаров.<br>Пожалуйста, подождите...
          </h2>
          <h2
            class="cart__block--descr cart__block--descr-loaded"
            v-show="
              products.length === 0 && this.$store.state.cartParams.cartUpdated
            "
          >
            Нет товаров для оформления&nbsp;заказа
          </h2>
          <ul
            class="cart__orders"
            v-show="this.$store.state.cartParams.cartUpdated"
          >
            <OrderItem
              v-for="item in products"
              :key="item.productId"
              :title="item.product.title"
              :price="item.product.price"
              :amount="item.amount"
              :id="item.productId"
            />
          </ul>

          <div class="cart__total">
            <p>
              Доставка: <b>{{ deliveryCost }} ₽</b>
            </p>
            <p>
              Итого товаров: <b>{{ totalAmount }}</b> на сумму
              <b>{{ (totalPrice + deliveryCost) }} ₽</b>
            </p>
          </div>

          <button
            class="cart__button button button--primery"
            type="submit"
            :disabled="
              (products.length === 0 &&
                this.$store.state.cartParams.cartUpdated) ||
                this.$store.state.cartParams.cartUpdate
            "
          >
            Оформить заказ
          </button>
        </div>
        <div
          class="cart__error form__error-block"
          v-if="formErrorMessage"
        >
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ formErrorMessage }}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import BaseFormText from '@/components/BaseFormText.vue';
import BaseFormTextarea from '@/components/BaseFormTextarea.vue';
import OrderItem from '@/components/OrderItem.vue';
import CartOptionsDelivery from '@/components/CartOptionsDelivery.vue';
import CartOptionsPayment from '@/components/CartOptionsPayment.vue';
// import numberFormat from '@/helpers/numberFormat';
import { mapGetters } from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default {
  data() {
    return {
      formData: {},
      formError: {},
      formErrorMessage: '',
      deliveryPrice: 'free',
      paymentType: 'card',
    };
  },
  components: {
    BaseFormText,
    BaseFormTextarea,
    OrderItem,
    CartOptionsDelivery,
    CartOptionsPayment,
  },
  computed: {
    ...mapGetters({
      products: 'cartDetailProducts',
      totalPrice: 'cartTotalPrice',
      totalAmount: 'cartCountProducts',
      deliveryCost: 'deliveryCost',
    }),
  },
  methods: {
    order() {
      this.formError = {}; // Очищаем поле перед запросом
      this.formErrorMessage = ''; // Очищаем сообщение об ошибке
      axios
        .post(
          `${API_BASE_URL}/api/orders`,
          {
            ...this.formData,
          },
          {
            params: {
              userAccessKey: this.$store.state.userAccessKey,
            },
          },
        )
        .then((response) => {
          this.$store.commit('resetCart');
          this.$store.commit('updateOrderInfo', response.data);
          this.$router.push({
            name: 'orderInfo',
            params: {
              id: response.data.id,
            },
          });
        })
        .catch((error) => {
          this.formError = error.response.data.error.request || {};
          this.formErrorMessage = error.response.data.error.message;
        });
    },
  },
};
</script>

<style scoped>
.cart__block--descr {
  position: relative;
  padding-left: 45px;
  font-size: 18px;
}
.cart__block--descr::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 35px;
  height: 35px;
  background-color: transparent;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  transform: translateY(-50%);
}
.cart__block--descr-loading::before {
  background-image: url('../assets/preloader_green.svg');
}
.cart__block--descr-loaded::before {
  background-image: url('../assets/sad.svg');
}
</style>
