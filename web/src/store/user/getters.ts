import { GetterTree } from 'vuex';
import { StoreInterface } from '../index';
import { UserStateInterface } from './state';

const getters: GetterTree<UserStateInterface, StoreInterface> = {
  someAction(/* context */) {
    // your code
  },
};

export default getters;
