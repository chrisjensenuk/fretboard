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
    ...mapActions(['startTrainer', 'stopTrainer', 'selectAnswer'])
    },
  computed: {
    ...mapGetters(['isTrainerStarted']),
    ...mapState(['trainerTimer', 'answerOptions'])
    },

})
export default class Fretboard extends Vue{
  private ac : AudioContext = new AudioContext();
  private guitar !: Player;

  private frets = fretData;

  private readonly msalLogin = new Msal.UserAgentApplication({
    auth:{
      clientId: "282a71eb-8a1f-4aed-a41e-920bafb38ff3",
      redirectUri: "https://localhost:8080/",
      postLogoutRedirectUri: "https://localhost:8080/",
      authority: "https://login.microsoftonline.com/a061aca6-27f7-48ab-81c8-172f7bc9f4e9"
    }
  });

  private readonly loginRequest = {
    scopes: ["User.ReadWrite", "https://fn-fretboard.azurewebsites.net/user_impersonation"]
  } as Msal.AuthenticationParameters;

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

  login(): void{
    var self = this;

    var auth = this.msalLogin.loginPopup(this.loginRequest)
    .then(function(loginResponse){
      //login success
      
      self.msalLogin.acquireTokenSilent({
        scopes: ["https://fn-fretboard.azurewebsites.net/user_impersonation"]
      })
      .then(function(accessTokenResponse){
        let accessToken = accessTokenResponse.accessToken;
        debugger;
      })

    }).catch(function (error) {
      //login failure
      console.log(error);
      debugger;
    });
  }

  logout(): void {
    this.msalLogin.logout();
  }
}
</script>

<template>
  <section>
    <div>
      <button @click="login">Login</button>
      <button @click="logout">Log out</button>
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