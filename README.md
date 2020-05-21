# Fretboard Trainer
A 'what's the note?' guitar trainer in Vue.js, Typescript and Soundfont-player.js

## Vision
How the 'What's the note' trainer should work:
1. Click a 'start training' button
2. Note labels hidden
3. A spot is displayed on random fret and string. A series of possible answer buttons are displayed below.
4. A configurable countdown starts
5. When time is up or a answer button is clicked. Show and play the note
6. Wait a few seconds then goto 2)
7. Continue until 'stop training' button is clicked

## Project setup
1) Install Vue CLI
```
npm install -g @vue/cli
```
(installed CLI v4.3.1)

2) Scaffold a new project
```
vue create fretboard
```
- Manually select features - only select Typescript (deselect Babel and Linter / Formatter)
- Use class-style component syntax? - Y
- Use babel alongside TypeScript - N (This is hobby project so I'm not interested in this yet)
- Where do you prefer placing config.... - In dedicated config files
- Save this as a preset for future projects? - N

## host and hot-reload (HMR) for development
```
npm run serve
```
http://localhost:8080
This local web server has HMR enabled by default.

### Compiles and minifies for production
```
npm run build
```

## Libraries
Using soundfont-player to manage the playing of the notes.
https://github.com/danigb/soundfont-player

## Todo/ideas
- ~~Click a string and play note using sound trainer~~
- ditch Component Classes as already defunct
- Add Vuex
- ~~Add remaining frets~~
- Show open string notes differently. Add the nut?
- ~~Put inlays on fret board~~
- Add wood background to fretboard
- Create 'What's the Note?' trainer configurable timeout
- Create 'What's the Triad' trainer
- Maybe configure the number of frets/strings you want to learn (specify start and end frets)




