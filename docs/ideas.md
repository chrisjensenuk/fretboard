# Ideas

## Vision
How the 'What's the note' trainer should work:
1. Click a 'start training' button
2. Note labels hidden
3. A spot is displayed on random fret and string. A series of possible answer buttons are displayed below. A timer starts
5. When an incorrect answer button is clicked. Hide the wrong answer
6. When the correct answer is clicked. Stop the timer
7. Record the time and the note
8. Go to 2.

A heat map is created based on how long it takes to guess the right note.  There will be the ability to see the heat map change over time so you can see your progress.

# Draw.io  
[draw.io](https://www.draw.io/?splash=0&clibs=Uhttps%3A%2F%2Fjgraph.github.io%2Fdrawio-libs%2Flibs%2Fintegration%2Fazure.xml)  
Azure Icon set: https://jgraph.github.io/drawio-libs/libs/integration/azure.xml

# Todo/Ideas

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
- ~~Click a string and play note using sound trainer~~
- ~~Add Vuex~~
- ~~Add remaining frets~~
- ~~Show open string notes differently. Add the nut?~~
- ~~Put inlays on fret board~~
- If use has logged in get login to persist between page reloads
- ~~Add configuration to SPA (e.g. setting clientId & tenantId at build time)~~
- Add Azure B2C for self service accounts
- Add Tests
- Add TypeScript linting on build
- ~~Create resources in Azure 'UK South' (As UK West doesn't do appInsights)~~
- Log javascript to AppInsights
- GCPR Cookie declaration

## Bugs/Fixes
- answer button ordering is off - currently D# comes before D
- need to run a separate stopwatch rather than relying on the interval to determine the time taken as code inside the interval lambda pauses the interval.