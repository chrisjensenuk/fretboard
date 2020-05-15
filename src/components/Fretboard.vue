<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Fret from './Fret.vue';

@Component({
  components: {
    Fret
  },
  data: function(){ 
      return {
        frets: [
            {fretNo: '11'},
            {fretNo: '12'},
            {fretNo: '16'}
        ]
    }
  }
})
export default class Fretboard extends Vue{}

</script>

<template>
    <div class="fretboard">
        <Fret v-for="fret in frets" :key="fret.fretNo" :fret="fret" />
    </div>
</template>

<style>
</style>