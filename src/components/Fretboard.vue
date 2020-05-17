<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FretData } from '@/common/Types'
import Fret from './Fret.vue';
import {instrument, Player} from 'soundfont-player';


@Component({
  components: {
    Fret
  }
})
export default class Fretboard extends Vue{
  private ac : AudioContext = new AudioContext();
  private guitar !: Player;

  private frets: Array<FretData> = [
    {fretNo: 0, string1: 'E4', string2: 'B3', string3: 'G3', string4: 'D3', string5: 'A2', string6: 'E2'},
    {fretNo: 1, string1: 'F4', string2: 'C4', string3: 'G#3', string4: 'D#3', string5: 'A#2', string6: 'F2'}
  ];

  playNote(note : string): void{
    if(this.guitar != null)
      this.guitar.play(note, this.ac.currentTime, { duration: 3})
  };

  created() : void{

    var self = this;
    
    instrument(this.ac, 'acoustic_guitar_steel').then(function (guitar : any) {
      self.guitar = guitar
    });
  };
}
</script>

<template>
    <div class="fretboard">
        <Fret v-for="fret in frets" :key="fret.fretNo" :fret="fret" @playNote="playNote" />
    </div>
</template>

<style>
</style>