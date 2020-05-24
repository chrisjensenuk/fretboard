import store, {NoteData} from '@/common/store'
import { fretData } from '@/common/fretData'

var noteTrainerInterval : number = 0;

class NoteTrainer {

    constructor(){
        store.watch((state) => state.trainerState,
        (oldValue, newValue) => {
            console.log("watch: oldValue:" + oldValue + ' newValue:' + newValue)
        })
    }
    
    run() : void{
        console.log("starting trainer");
        store.dispatch("startTrainer");

        //todo: randomly get a note
        var answerNote = this.getRandomNote();

        console.log("random note:" + answerNote);

        store.dispatch("setAnswerNote", answerNote);

        //todo: mark the position of the note on the fretboard

        //todo: set the answer buttons to 4 random + noteToGuess

        //todo: wait for the answer button click

        //todo: show how long it took, if correct, play the note and dispaly the note
        
        var timerInterval = 100;
        store.dispatch("clearTrainerTimer")

        noteTrainerInterval = setInterval(function(){
            if(store.getters.isTrainerStarted == false){
                clearInterval(noteTrainerInterval);
            }
            else{
                store.dispatch("addTrainerTimer", timerInterval)
            }
        }, timerInterval)
    }

    getRandomNote() : NoteData {
        let randomFretNo = rand(0, fretData.length - 1);
        let fret = fretData[randomFretNo];
        let randomStringNo = rand(0, fret.length - 1);
        let randomNote = fret[randomStringNo];
        
        let noteData : NoteData = {
            fretNo : randomFretNo,
            stringNo : randomStringNo,
            note : randomNote
        };

        return noteData;
    }

}



function rand(min: number, max: number): number {
    return (Math.random() * (max - min + 1) | 0) + min;
}  

export default new NoteTrainer();