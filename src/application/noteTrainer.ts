import store from '@/common/store'
import { fretData } from '@/common/fretData'

class NoteTrainer {

    constructor(){
        store.watch((state) => store.state.trainerState,
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

        setTimeout(function(){
            console.log("stopping trainer");
            store.dispatch("stopTrainer");
        },1000);
    }

    getRandomNote() : string{
        let randomFretNo = rand(0, fretData.length - 1);
        let fret = fretData[randomFretNo];
        let randomString = rand(0, fret.length - 1);
        let note = fret[randomString];

        if(note === undefined)
        {
            debugger;
        }

        return note;
    }

}

function rand(min: number, max: number): number {
    return (Math.random() * (max - min + 1) | 0) + min;
}  

export default new NoteTrainer();