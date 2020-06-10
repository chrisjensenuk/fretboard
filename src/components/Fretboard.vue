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
    ...mapGetters(['isTrainerStarted', 'getLoginName', 'getLoginError']),
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

  login_tmp(): void{
    var self = this;

    let msalLogin = new Msal.UserAgentApplication({
      auth:{
        clientId: "95f851f6-de0f-4dae-9d39-4b0fc90dc6b1",
        redirectUri: "https://localhost:8080/",
        postLogoutRedirectUri: "https://localhost:8080/",
        authority: "https://login.microsoftonline.com/a061aca6-27f7-48ab-81c8-172f7bc9f4e9"
      }
    });

    var auth = msalLogin.loginPopup({
    scopes: ["User.ReadWrite", "https://fn-fretboard2.azurewebsites.net/user_impersonation"]
    })
    .then(function(loginResponse){
      //login success
      
      msalLogin.acquireTokenSilent({
        scopes: ["https://fn-fretboard2.azurewebsites.net/user_impersonation"]
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
}
</script>

<template>
  <section>
    <div>
      <button @click="login">Login</button>
      <h2 v-if="getLoginName">Hi {{ getLoginName }}!</h2>
      <div v-if="getLoginError">{{ getLoginError }}</div>
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