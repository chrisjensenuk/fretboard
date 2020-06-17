# Vue.js and TypeScript

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

## Development and Production Configuration
I've created 2 configuration files `/src/config/development.js` and `/src/config/production.js`.  One of these gets included into the build by webpack depending on whether `npm run serve` or `npm run build` has been used.  This creates an external javascript `js/config.js` file that needs to be included in `index.html`. This javascript files create and new global property called `window.__env`. The ts file  `common/config.ts` returns the typed config values.

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