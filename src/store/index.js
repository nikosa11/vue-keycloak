import { createStore } from 'vuex';
import { notification } from './notification';

const store = createStore({
  modules: {
    notification
  },
  state() {
    return {
      count: 0,
      isLoggedIn: false,
      userData: {},
      wizzardOn: false,
      userId: null
    };
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    decrement(state) {
      state.count--;
    },
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
    },
    setUserData(state, userData) {
      state.userData = userData;
    },
    setWizzard(state, data) {
      state.wizzardOn = data;
    },
    setUserId(state, id) {
      state.userId = id;
    }
  },
  actions: {
    // Εδώ μπορείτε να ορίσετε δράσεις που αλλάζουν την κατάσταση του store μέσω mutations
  },
  getters: {
    // Εδώ μπορείτε να ορίσετε getters για την πρόσβαση στα δεδομένα του store
  }
});

export default store;