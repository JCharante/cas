import axios, { AxiosInstance } from 'axios';
import { boot } from 'quasar/wrappers';

const axiosInstance = axios.create({
  // baseURL: 'http://127.0.0.1:3300',
  baseURL: 'https://cas-api.jcharante.com',
});

declare module 'vue/types/vue' {
  interface Vue {
    $axios: AxiosInstance;
  }
}

export default boot(({ Vue }) => {
  Vue.prototype.$axios = axiosInstance;
});
