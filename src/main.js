// Главный файл (где создаётся)
import { createApp, h } from 'vue'; // Импортируем createApp (из папки node_modules)
import App from './App.vue'; // Импортируем приложение App.vue (с именем App)
import router from './router'; // Добавляем router к корневому экземпляру Vue
import store from './store'; // Импортируем хранилище

// Инициализируем Vue instance
const app = createApp({
  render: () => h(App),
})

app.use(router); // Подключаем маршрутизатор (роутер)
app.use(store); // Подключаем хранилище
app.mount('#app'); // Крепим Vue instance к div c id "App" (в public/index.html)
