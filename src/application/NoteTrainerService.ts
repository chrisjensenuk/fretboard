/*
Core business rules for the application.
Needs to be agnostic of Vue/Vuex.
Vuex store calls functions on this class
The class is not to be imported into components. Should only be imported into the Vuex store
*/

import { NoteData, fretData, TrainerState, Answer } from '@/common/models'

const timerInterval = 100 as number;

class NoteTrainerService {

    //callback functions to be overridden by calling class
    stateChanged!: (state: TrainerState) => void;
    answerNoteChanged!: (note: NoteData) => void;
    answerOptionsChanged!: (answerOptions: Array<NoteData>) => void;
    timerChanged!: (time: number) => void;
    saveAnswer!:(answer : Answer) => void;
    addWrongChoice!:(wrongNote : NoteData) => void;
    clearWrongChoices!:() => void;
    getWrongChoices!:() => Array<NoteData>;

    static readonly timerInterval = 100 as number;

    private noteTrainerInterval : number = 0;
    private trainerState: TrainerState;
    private startTime: Date = new Date();

    constructor(){
        this.trainerState = TrainerState.Stopped;
    }
    
    start() : void{
        var self = this;

        console.log("starting trainer");
        
        //forget previous guesses
        this.clearWrongChoices();
        
        //get a random note
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
        this.startTime = new Date();
        this.timerChanged(0);

        this.trainerState = TrainerState.Started;
        this.stateChanged(this.trainerState);

        this.noteTrainerInterval = setInterval(function(){
            let elapsedTime = new Date().getTime() - self.startTime.getTime();
            self.timerChanged(elapsedTime);
        }, timerInterval)
    }

    stop(): void{
        this.trainerState = TrainerState.Stopped;
        this.stateChanged(this.trainerState);
        
        this.answerOptionsChanged([]);
        
        clearInterval(this.noteTrainerInterval);
    }

    chooseAnswer(chosenNote: NoteData, correctNote: NoteData | null){
        
        //is the answer correct?
        if(chosenNote == correctNote){
            console.log("correct!");

            var answer: Answer = {
                fretNo: chosenNote.fretNo,
                stringNo: chosenNote.stringNo,
                note: chosenNote.note,
                timeTaken: new Date().getTime() - this.startTime.getTime(),
                attempts : this.getWrongChoices().length + 1
            }

            //log correct guess and time time and number of attempts
            this.saveAnswer(answer);

            //do a hurrah!

            //go get the next note
            this.stop();
            this.start();
        }
        else{
          //save the wrong selection
          this.addWrongChoice(chosenNote);

          console.log("try again");
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