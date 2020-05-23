import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

enum TrainerState {
    Stopped,
    Started
}


export default new Vuex.Store({
    state: {
        trainerState: TrainerState.Stopped,
        answerNote!: null as null | string
    },

    mutations: {
        SET_TRAINER_STATE(state, trainerState){
            state.trainerState = trainerState;
        },

        SET_ANSWER_NOTE(state, answerNote : string){
            state.answerNote = answerNote;
        }
    },

    actions: {
        startTrainer(context){
            context.commit('SET_TRAINER_STATE', TrainerState.Started);
        },

        stopTrainer(context){
            context.commit('SET_TRAINER_STATE', TrainerState.Stopped);
        },

        setAnswerNote(context, answerNote : string){
            context.commit('SET_ANSWER_NOTE', answerNote);
        }
    },

    getters: {
        isTrainerStarted: state => {
            return state.trainerState == TrainerState.Started;
        }
    }
})