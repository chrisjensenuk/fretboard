<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import store from '@/common/store'
import Fret from './Fret.vue';
import {instrument, Player} from 'soundfont-player';
import {NoteData, fretData} from '@/common/models';
import { mapActions } from 'vuex';


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
    ...mapActions(['startTrainer', 'stopTrainer', 'selectAnswer'])
  }
})
export default class Fretboard extends Vue{
  private ac : AudioContext = new AudioContext();
  private guitar !: Player;

  private frets = fretData;

  playNote(note : string): void{
    if(this.guitar != null)
      this.guitar.play(note, this.ac.currentTime, { duration: 3})
  };
  
  created() : void{
    var self = this;
    
    instrument(this.ac, 'acoustic_guitar_steel', {gain : 5}).then(function (guitar : any) {
      self.guitar = guitar
    });
  };
}
</script>

<template>
  <section>
    <div>
      Note Trainer:
      <button @click="startTrainer" v-if="$store.getters.isTrainerStarted == false">Start</button>
      <button @click="stopTrainer" v-if="$store.getters.isTrainerStarted">Stop</button>
      <div>Time: {{ $store.state.trainerTimer | timerFilter }}</div>
    </div>
    <br><br>

    <div class="fretboard">
        <Fret v-for="(fret, index) in frets" :key="index" :fret="fret" :fretNo="index" @playNote="playNote" />
    </div>

    <div v-if="$store.state.answerOptions != null" class="answer-buttons">
      <button @click="selectAnswer($store.state.answerOptions[0])" class="answer-button">{{ $store.state.answerOptions[0].note | noteFilter }}</button>
      <button @click="selectAnswer($store.state.answerOptions[1])" class="answer-button">{{ $store.state.answerOptions[1].note | noteFilter }}</button>
      <button @click="selectAnswer($store.state.answerOptions[2])" class="answer-button">{{ $store.state.answerOptions[2].note | noteFilter }}</button>
      <button @click="selectAnswer($store.state.answerOptions[3])" class="answer-button">{{ $store.state.answerOptions[3].note | noteFilter }}</button>
      <button @click="selectAnswer($store.state.answerOptions[4])" class="answer-button">{{ $store.state.answerOptions[4].note | noteFilter }}</button>
    </div>
  </section>
</template>

<style>
</style>