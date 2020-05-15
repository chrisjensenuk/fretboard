<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Fretboard/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Fretboard from './components/Fretboard.vue';

@Component({
  components: {
    Fretboard
  },
})
export default class App extends Vue {}
</script>

<style>

</style>
