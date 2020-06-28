export interface UserStateInterface {
  sessionKey: string | null;
}

const state: UserStateInterface = {
  sessionKey: null,
};

export default state;
