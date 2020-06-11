# Fretboard Trainer
A 'what's the note?' guitar trainer in Vue.js, Typescript and Soundfont-player.js.

JAMstack architecture using Azure Functions for backend work.

## Vision
How the 'What's the note' trainer should work:
1. Click a 'start training' button
2. Note labels hidden
3. A spot is displayed on random fret and string. A series of possible answer buttons are displayed below. A timer starts
5. When an incorrect answer button is clicked. Hide the wrong answer
6. When the correct answer is clicked. Stop the timer
7. Record the time and the note
8. Go to 2.

## SPA Project setup
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

## Architecture and Deployment
[documentation regarding the architecture and eployment via ARM Templates and scripting](docs/architecture.md)

## Authentication
[documentation regarding configuration of authentication](/docs/authentication.md)

## Resources
https://vuex.vuejs.org/  
https://class-component.vuejs.org/  
[vue-class-component github documentation](https://github.com/vuejs/vue-class-component)  
[vue-property-decorator github documentation](https://github.com/kaorun343/vue-property-decorator)  
[vuex-module-decorators](https://github.com/championswimmer/vuex-module-decorators)  
https://github.com/championswimmer/vuex-module-decorators/blob/master/docs/pages/core/actions.md  

## Libraries
Using soundfont-player to manage the playing of the notes.
https://github.com/danigb/soundfont-player

## Todo/ideas
- ~~Click a string and play note using sound trainer~~
- ~~Add Vuex~~
- ~~Add remaining frets~~
- ~~Show open string notes differently. Add the nut?~~
- ~~Put inlays on fret board~~
- If use has logged in get login to persist between page reloads
- Add configuration to SPA (e.g. setting clientId & tenantId at build time)
- Add Azure B2C for self service accounts
- Add Tests
- Add linting on build
- Create resources in Azure 'UK South' (As UK West doesn't do appInsights)
- Use a dot instead of an X to guess the note
- Add wood background to fretboard?
- Create 'What's the Note?' trainer configurable timeout
- Create 'What's the Triad' trainer
- Create a 'Listen to the Note' trainre.  Note is played and the correct string/fret needs to be clicked
- Maybe configure the number of frets/strings you want to learn (specify start and end frets)
- Record length of time take to click a button and whether successful or not. Record datetime too.
- Create heat map of correct/incorrect based on time taken
- Save timings to Azure? - logic app? table storage? what's cheapest?
- View 'sessions' and improvement over time
- Log javascript to AppInsights

## Bugs/Fixes
- answer button ordering is off - currently D# comes before D
- need to run a separate stopwatch rather than relying on the interval to determine the time taken as code inside the interval lambda pauses the interval.