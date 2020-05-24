<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import store, {NoteData} from '@/common/store'
import * as Soundfont from 'soundfont-player';

@Component
export default class Fret extends Vue {
  @Prop() private fretNo!: number;
  @Prop() private fret!: Array<string>;

  playNote(note : string): void{
      this.$emit('playNote', note)
  }

  noteText(fret : Array<string>, fretNo : number, stringNo : number) : string {
    if(store.getters.isTrainerStarted){
      
      let answerNote = store.state.answerNote;
      if(answerNote != null && answerNote.fretNo == fretNo && answerNote.stringNo == stringNo)
      {
        return "X";
      }

      return "";
    }

    var note = fret[stringNo];

    return note.replace('5', '').replace('4', '').replace('3', '').replace('2', '').replace('1', '');
  }

  fretClass() {
      return {
        fret : true,
        singleInlay : [3,5,7,9].indexOf(this.fretNo) > -1,
        doubleInlay : this.fretNo == 12
      };
  }
}
</script>

<template>
  <div :id="'fret_' + fretNo" :class="fretClass()">
    <div class="note string_1" @click="playNote(fret[0])">{{noteText(fret, fretNo, 0)}}</div>
    <div class="note string_2" @click="playNote(fret[1])">{{noteText(fret, fretNo, 1)}}</div>
    <div class="note string_3" @click="playNote(fret[2])">{{noteText(fret, fretNo, 2)}}</div>
    <div class="note string_4" @click="playNote(fret[3])">{{noteText(fret, fretNo, 3)}}</div>
    <div class="note string_5" @click="playNote(fret[4])">{{noteText(fret, fretNo, 4)}}</div>
    <div class="note string_6" @click="playNote(fret[5])">{{noteText(fret, fretNo, 5)}}</div>
  </div>
</template>

