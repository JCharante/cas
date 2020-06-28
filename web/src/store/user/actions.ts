import { ActionTree } from 'vuex';
import { LocalStorage } from 'quasar';
import { StoreInterface } from '../index';
import { UserStateInterface } from './state';

const actions: ActionTree<UserStateInterface, StoreInterface> = {
  saveStoreToLocalStorage(context) {
    LocalStorage.set('vuex-store-user', context.state);
  },
  buildStateFromLocalStorage(context) {
    const state: object | null = LocalStorage.getItem('vuex-store-user');
    if (state !== null) {
      context.state = { ...context.state, ...state };
    }
  },
};

export default actions;
