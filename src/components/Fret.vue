<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Fret extends Vue {
  @Prop() private fret!: Object;
}
</script>

<template>
    <div v-bind:id="fret.fretNo" class="fret">
        <div id="string_0_1" class="note string_1" data-note="E4">E</div>
        <div id="string_0_2" class="note string_2" data-note="B3">B</div>
        <div id="string_0_3" class="note string_3" data-note="G3">G</div>
        <div id="string_0_4" class="note string_4" data-note="D3">D</div>
        <div id="string_0_5" class="note string_5" data-note="A2">A</div>
        <div id="string_0_6" class="note string_6" data-note="E2">E</div>
    </div>
</template>

