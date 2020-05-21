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
    {fretNo: 1, string1: 'F4', string2: 'C4', string3: 'G#3', string4: 'D#3', string5: 'A#2', string6: 'F2'},
    {fretNo: 2, string1: 'F#4', string2: 'C#4', string3: 'A3', string4: 'E3', string5: 'B2', string6: 'F#2'},
    {fretNo: 3, string1: 'G4', string2: 'D4', string3: 'A#3', string4: 'F3', string5: 'C3', string6: 'G2'},
    {fretNo: 4, string1: 'G#4', string2: 'D#4', string3: 'B3', string4: 'F#3', string5: 'C#3', string6: 'G#2'},
    {fretNo: 5, string1: 'A4', string2: 'E4', string3: 'C4', string4: 'G3', string5: 'D3', string6: 'A2'},
    {fretNo: 6, string1: 'A#4', string2: 'F4', string3: 'C#4', string4: 'G#3', string5: 'D#3', string6: 'A#2'},
    {fretNo: 7, string1: 'B4', string2: 'F#4', string3: 'D4', string4: 'A3', string5: 'E3', string6: 'B2'},
    {fretNo: 8, string1: 'C5', string2: 'G4', string3: 'D#4', string4: 'A#3', string5: 'F3', string6: 'C3'},
    {fretNo: 9, string1: 'C#5', string2: 'G#4', string3: 'E4', string4: 'B3', string5: 'F#3', string6: 'C#3'},
    {fretNo: 10, string1: 'D5', string2: 'A4', string3: 'F4', string4: 'C4', string5: 'G3', string6: 'D3'},
    {fretNo: 11, string1: 'D#5', string2: 'A#4', string3: 'F#4', string4: 'C#4', string5: 'G#3', string6: 'D#3'},
    {fretNo: 12, string1: 'E5', string2: 'B4', string3: 'G4', string4: 'D4', string5: 'A3', string6: 'E3'},
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