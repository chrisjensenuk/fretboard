# Fretboard Trainer
A 'what's the note?' guitar trainer in Vue.js, Typescript and WebMidi.js

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


### Compiles and hot-reloads for development
```
npm run serve
```
http://localhost:8080
This local web server has HMR enabled by default.

### Compiles and minifies for production
```
npm run build
```