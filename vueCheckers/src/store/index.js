import {createStore} from 'vuex';

export default createStore({
  state:{
    currentPlayer: "white-checker"
  },
  getters: {

  },
  mutations:{
    changeState(state){
      switch (state.currentPlayer) {
        case "white-checker":
          state.currentPlayer = "black-checker";
          break;
        case "black-checker":
          state.currentPlayer = "white-checker";
          break;
      }
    }
  },
  actions: {

  },
})