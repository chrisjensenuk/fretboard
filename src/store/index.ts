import Vue from 'vue'
import Vuex from 'vuex'
import {NoteData, TrainerState} from '@/common/models'
import NoteTrainerService from '@/application/NoteTrainerService'
import storeApi from '@/store/storeApi'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

const store = new Vuex.Store({
    plugins: [createPersistedState()],

    state: {
        trainerState: TrainerState.Stopped,
        answerNote!: null as null | NoteData,
        trainerTimer: 0 as number,
        answerOptions: null as null | Array<NoteData>,
    },

    modules:{
        storeApi
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
        },

        SET_ANSWER_OPTIONS(state, answerOptions : Array<NoteData>){
            state.answerOptions = answerOptions;
        }
    },

    actions: {

        startTrainer(context){
            NoteTrainerService.start();
        },

        stopTrainer(context){
            NoteTrainerService.stop();
        },

        selectAnswer(context, note : NoteData){
            NoteTrainerService.selectAnswer(note, context.state.answerNote);
        },

        setTrainerState(context, state: TrainerState){
            context.commit('SET_TRAINER_STATE', state);
        },

        setAnswerNote(context, answerNote : NoteData){
            context.commit('SET_ANSWER_NOTE', answerNote);
        },

        setTrainerTimer(context, time: number){
            context.commit('SET_TRAINER_TIMER', time);
        },
        
        setAnswerOptions(context, answerOptions : Array<NoteData>){
            context.commit('SET_ANSWER_OPTIONS', answerOptions);
        }
    },

    getters: {
        isTrainerStarted: state => state.trainerState == TrainerState.Started
    }
});

//hooking up callbacks from service
NoteTrainerService.stateChanged = (trainerState: TrainerState) => store.dispatch("setTrainerState", trainerState)
NoteTrainerService.answerNoteChanged = (answerNote: NoteData) => store.dispatch("setAnswerNote", answerNote);
NoteTrainerService.answerOptionsChanged = (answerOptions: Array<NoteData>) => store.dispatch("setAnswerOptions", answerOptions);
NoteTrainerService.timerChanged = (timer: number) => store.dispatch("setTrainerTimer", timer);
NoteTrainerService.saveGuess = () => store.dispatch("saveGuess", null);

export default store;