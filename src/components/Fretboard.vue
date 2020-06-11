<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import store from '@/common/store'
import Fret from './Fret.vue';
import {instrument, Player} from 'soundfont-player';
import {NoteData, fretData} from '@/common/models';
import { mapActions, mapGetters, mapState } from 'vuex';
import * as Msal from 'msal'


@Component({
  components: {
    Fret
  },
  filters:{
    timerFilter(value : number){
      return value / 1000
    }
  },
  methods: {
    ...mapActions(['startTrainer', 'stopTrainer', 'selectAnswer', 'login'])
    },
  computed: {
    ...mapGetters(['isTrainerStarted', 'getLoginName', 'getLoginError', 'getResponse']),
    ...mapState(['trainerTimer', 'answerOptions']),
    },

})
export default class Fretboard extends Vue{
  private ac : AudioContext = new AudioContext();
  private guitar !: Player;

  private frets = fretData;

  created() : void{
    var self = this;
    
    instrument(this.ac, 'acoustic_guitar_steel', {gain : 5}).then(function (guitar : any) {
      self.guitar = guitar
    });
  };

  playNote(note : string): void{
    if(this.guitar != null)
      this.guitar.play(note, this.ac.currentTime, { duration: 3})
  };
}
</script>

<template>
  <section>
    <div>
      <button @click="login">Login</button>
      <h2 v-if="getLoginName">Hi {{ getLoginName }}!</h2>
      <div v-if="getLoginError" style="color:red">{{ getLoginError }}</div>
      <div v-if="getResponse" style="border:1px solid green">{{ getResponse }}</div>
    </div>
    <div>
      Note Trainer:
      <button @click="startTrainer" v-if="isTrainerStarted == false">Start</button>
      <button @click="stopTrainer" v-if="isTrainerStarted">Stop</button>
      <div>Time: {{ trainerTimer | timerFilter }}</div>
    </div>
    <br><br>

    <div class="fretboard">
        <Fret v-for="(fret, index) in frets" :key="index" :fret="fret" :fretNo="index" @play-note="playNote" />
    </div>

    <div v-if="answerOptions != null" class="answer-buttons">
      <button v-for="(answerOption, index) in answerOptions" :key="index" @click="selectAnswer(answerOption)" class="answer-button">{{ answerOption.note | noteFilter }}</button>
    </div>
  </section>
</template>

<style>
</style>