<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FretData } from '@/common/Types';
import * as Soundfont from 'soundfont-player';

@Component
export default class Fret extends Vue {
  @Prop() private fret!: FretData;

  playNote(note : string): void{
      this.$emit('playNote', note)
  }

  displayNote(note : string) : string {
    return note.replace('5', '').replace('4', '').replace('3', '').replace('2', '').replace('1', '');
  }

  fretClass() {
      return {
        fret : true,
        singleInlay : [3,5,7,9].indexOf(this.fret.fretNo) > -1,
        doubleInlay : this.fret.fretNo == 12
      };
  }
}
</script>

<template>
  <div :id="'fret_' + fret.fretNo" :class="fretClass()">
    <div class="note string_1" @click="playNote(fret.string1)">{{displayNote(fret.string1)}}</div>
    <div class="note string_2" @click="playNote(fret.string2)">{{displayNote(fret.string2)}}</div>
    <div class="note string_3" @click="playNote(fret.string3)">{{displayNote(fret.string3)}}</div>
    <div class="note string_4" @click="playNote(fret.string4)">{{displayNote(fret.string4)}}</div>
    <div class="note string_5" @click="playNote(fret.string5)">{{displayNote(fret.string5)}}</div>
    <div class="note string_6" @click="playNote(fret.string6)">{{displayNote(fret.string6)}}</div>
  </div>
</template>

