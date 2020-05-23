import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

enum TrainerState {
    Stopped,
    Started
}

export default new Vuex.Store({
    state: {
        trainerState: TrainerState.Stopped
    },

    mutations: {
        CHANGE_TRAINER_STATE(state, trainerState){
            state.trainerState = trainerState;
        }
    },

    actions: {
        startTrainer(context){
            context.commit('CHANGE_TRAINER_STATE', TrainerState.Started)
        },
        stopTrainer(context){
            context.commit('CHANGE_TRAINER_STATE', TrainerState.Stopped)
        }
    },

    getters: {
        isTrainerStarted: state => {
            return state.trainerState == TrainerState.Started;
        }    
    }
})