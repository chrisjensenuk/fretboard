<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapActions, mapGetters, mapState } from 'vuex';
import store from '@/store'
import {NoteData, fretData} from '@/common/models';

@Component({
  methods: {
    ...mapActions(['chooseAnswer'])
    },
  computed: {
    ...mapState(['answerOptions']),
    },
})
export default class Fretboard extends Vue{

  isChosenAndWrong(note : NoteData) : boolean{
      return this.$store.state.wrongChoices.includes(note);
  }

}
</script>

<template>
    <div v-if="answerOptions != null" class="answer-buttons">
      <button  v-for="(answerOption, index) in answerOptions" 
        :key="index"
        :disabled="isChosenAndWrong(answerOption)"
        @click="chooseAnswer(answerOption)" 
        class="answer-button">{{ answerOption.note | noteFilter }}
      </button>
    </div>
</template>