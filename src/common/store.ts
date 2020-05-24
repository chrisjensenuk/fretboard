import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

enum TrainerState {
    Stopped,
    Started
}

export interface NoteData{
    fretNo : number,
    stringNo: number,
    note: string
}

export default new Vuex.Store({
    state: {
        trainerState: TrainerState.Stopped,
        answerNote!: null as null | NoteData,
        trainerTimer: 0 as number
    },

    mutations: {
        SET_TRAINER_STATE(state, trainerState){
            state.trainerState = trainerState;
        },

        SET_ANSWER_NOTE(state, answerNote : NoteData){
            state.answerNote = answerNote;
        },

        SET_TRAINER_TIMER(state, trainerTimer : number){
            state.trainerTimer = trainerTimer;
        }
    },

    actions: {
        startTrainer(context){
            context.commit('SET_TRAINER_STATE', TrainerState.Started);
        },

        stopTrainer(context){
            context.commit('SET_TRAINER_STATE', TrainerState.Stopped);
        },

        setAnswerNote(context, answerNote : NoteData){
            context.commit('SET_ANSWER_NOTE', answerNote);
        },

        clearTrainerTimer(context){
            context.commit('SET_TRAINER_TIMER', 0);
        },
        
        addTrainerTimer(context, trainerTimer : number){
            context.commit('SET_TRAINER_TIMER', context.state.trainerTimer + trainerTimer);
        }
    },

    getters: {
        isTrainerStarted: state => {
            return state.trainerState == TrainerState.Started;
        }
    }
})