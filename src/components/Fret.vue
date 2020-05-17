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
}
</script>

<template>
  <div :id="fret.fretNo" class="fret">
    <div class="note string_1" @click="playNote(fret.string1)">{{fret.string1}}</div>
    <div class="note string_2" @click="playNote(fret.string2)">{{fret.string2}}</div>
    <div class="note string_3" @click="playNote(fret.string3)">{{fret.string3}}</div>
    <div class="note string_4" @click="playNote(fret.string4)">{{fret.string4}}</div>
    <div class="note string_5" @click="playNote(fret.string5)">{{fret.string5}}</div>
    <div class="note string_6" @click="playNote(fret.string6)">{{fret.string6}}</div>
  </div>
</template>

