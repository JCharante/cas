import { MutationTree } from 'vuex';
import { UserStateInterface } from './state';

const mutation: MutationTree<UserStateInterface> = {
  saveSessionId(state: UserStateInterface, sessionKey: string) {
    state.sessionKey = sessionKey;
  },
};

export default mutation;
