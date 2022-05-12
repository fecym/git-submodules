import Vue from "vue";
import Vuex from "vuex";
import modules from "./requireModules";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    ...modules,
  },
});
