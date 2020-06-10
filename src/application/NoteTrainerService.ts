/*
Core business rules for the application.
Needs to be agnostic of Vue/Vuex.
Vuex store calls functions on this class
The class is not to be imported into components. Should only be imported into the Vuex store
*/

import { NoteData, fretData, TrainerState } from '@/common/models'

const timerInterval = 100 as number;

class NoteTrainerService {

    //callback functions to be overridden by calling class
    stateChanged: (state: TrainerState) => void;
    answerNoteChanged: (note: NoteData) => void;
    answerOptionsChanged: (answerOptions: Array<NoteData>) => void;
    timerChanged: (time: number) => void;

    static readonly timerInterval = 100 as number;

    private noteTrainerInterval : number = 0;
    private trainerState: TrainerState;

    constructor(){
        //terminate callbacks that are expected to be overridden
        this.stateChanged = () => {};
        this.answerNoteChanged = () => {};
        this.answerOptionsChanged = () => {};
        this.timerChanged = () => {};

        this.trainerState = TrainerState.Stopped;
    }
    
    start() : void{
        var self = this;

        console.log("starting trainer");
        
        //todo: randomly get a note
        var answerNote = self.getRandomNote();
        console.log("random note:" + answerNote.note);
        self.answerNoteChanged(answerNote);

        //set answer options. 1 correct and 4 random options
        var answerOptions = [answerNote] as Array<NoteData>;
        while(answerOptions.length < 5){
            let randomAnswer = self.getRandomNote();
            
            //make sure answer choices are unique
            let alreadyAdded = answerOptions.some(function(el){
                return el.note.replace(/[1-5]/g, '') == randomAnswer.note.replace(/[1-5]/g, ''); 
            });
            if(!alreadyAdded){
                answerOptions.push(randomAnswer);
            }
        }
        //sort answers
        answerOptions = answerOptions.sort(function(n1,n2){
            return (n1.note < n2.note) ? -1 : (n1.note > n2.note) ? 1 : 0;
        })
        self.answerOptionsChanged(answerOptions);
        //todo: wait for the answer button click

        //todo: show how long it took, if correct, play the note and display the note
        
        var timer = 0;
        this.timerChanged(timer);

        this.trainerState = TrainerState.Started;
        this.stateChanged(this.trainerState);

        this.noteTrainerInterval = setInterval(function(){
            timer += timerInterval;
            self.timerChanged(timer);
        }, timerInterval)
    }

    stop(): void{
        this.trainerState = TrainerState.Stopped;
        this.stateChanged(this.trainerState);

        clearInterval(this.noteTrainerInterval);
    }

    selectAnswer(guessedNote: NoteData, correctNote: NoteData | null){
        //is the answer correct?
        if(guessedNote == correctNote){
            alert("correct!");

            //log correct guess and time time and number of attempts

            //do a hurrah!

            //go get the next note
            this.stop();
            this.start();
        }
        else{
          //try again
          alert("try again");
        }
    }

    private getRandomNote() : NoteData {
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

export default new NoteTrainerService();