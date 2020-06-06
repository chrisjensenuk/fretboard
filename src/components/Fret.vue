<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import store from '@/common/store';
import * as Soundfont from 'soundfont-player';
import { NoteData } from '@/common/models';
import { mapActions, mapGetters, mapState } from 'vuex';

@Component({
  computed: {
    ...mapGetters(['isTrainerStarted']),
    ...mapState(['answerNote'])
  }
})
export default class Fret extends Vue {
  @Prop() private fretNo!: number;
  @Prop() private fret!: Array<string>;

  @Emit()
  playNote(note : string){
    return note;
  }

  isTrainerStarted?: boolean;
  answerNote?: NoteData;

  noteText(fret : Array<string>, fretNo : number, stringNo : number) : string {
    if(this.isTrainerStarted){
      
      if(this.answerNote != null && this.answerNote.fretNo == fretNo && this.answerNote.stringNo == stringNo){
        return "X";
      }

      return "";
    }

    return fret[stringNo];
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
    <div class="note string_1" @click="playNote(fret[0])">{{noteText(fret, fretNo, 0) | noteFilter}}</div>
    <div class="note string_2" @click="playNote(fret[1])">{{noteText(fret, fretNo, 1) | noteFilter}}</div>
    <div class="note string_3" @click="playNote(fret[2])">{{noteText(fret, fretNo, 2) | noteFilter}}</div>
    <div class="note string_4" @click="playNote(fret[3])">{{noteText(fret, fretNo, 3) | noteFilter}}</div>
    <div class="note string_5" @click="playNote(fret[4])">{{noteText(fret, fretNo, 4) | noteFilter}}</div>
    <div class="note string_6" @click="playNote(fret[5])">{{noteText(fret, fretNo, 5) | noteFilter}}</div>
  </div>
</template>

