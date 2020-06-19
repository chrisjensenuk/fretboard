<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import store from '@/store'
import Fret from './Fret.vue';
import LoginBar from './LoginBar.vue';
import AnswerButtons from './AnswerButtons.vue';
import {instrument, Player} from 'soundfont-player';
import {NoteData, fretData} from '@/common/models';
import { mapActions, mapGetters, mapState } from 'vuex';

declare var confetti: any;

@Component({
  components: {
    Fret,
    LoginBar,
    AnswerButtons
  },
  filters:{
    timerFilter(value : number){
      return (value / 1000).toFixed(2);
    }
  },
  methods: {
    ...mapActions(['startTrainer', 'stopTrainer', 'selectAnswer'])
    },
  computed: {
    ...mapGetters(['isTrainerStarted']),
    ...mapState(['trainerTimer', 'answerOptions']),
    }
})
export default class Fretboard extends Vue{
  private ac : AudioContext = new AudioContext();
  private guitar !: Player;
  private frets = fretData;

  //make TypeScript aware of mapActions/mapGetters/mapState
  stopTrainer!:() => void;

  created() : void{
    var self = this;
    
    instrument(this.ac, 'acoustic_guitar_steel', {gain : 5}).then(function (guitar : any) {
      self.guitar = guitar
    });

    //always load the page with the trainer stopped
    this.stopTrainer();
  };

  @Watch("$store.state.wrongChoices")
  watchWrongChoices(){
    if(this.$store.state.wrongChoices.length > 0){
          //A wrong note has just been chosen.
          if(this.guitar != null){
            this.guitar.play("D2", this.ac.currentTime, { duration: 0.5});
            this.guitar.play("C#2", this.ac.currentTime, { duration: 0.5});
          }
       }
  }

  @Watch("$store.state.answers")
  watchAnswers(){
    let answers = this.$store.state.answers;
    if(answers.length > 0){
      var answer = answers[answers.length - 1];

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      this.playNote(answer.note);
    }
  }

  playNote(note : string): void{
    if(this.guitar != null)
      this.guitar.play(note, this.ac.currentTime, { duration: 3})
  };
}
</script>

<template>
  <section>

    <LoginBar />
    
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

    <AnswerButtons />

  </section>
</template>

<style>
</style>