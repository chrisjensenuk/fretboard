module.exports = {
  devServer:{
    https: true,
    public: "https://localhost:8080"
  },
  chainWebpack(config) {

    //getting TypeScripts @ to tally with webpack
    config.resolve.alias.delete("@");
    config.resolve
      .plugin("tsconfig-paths")
      .use(require("tsconfig-paths-webpack-plugin"));
    
    //swapping different config depending on debugging or building
    var configFile = (process.env.npm_lifecycle_event === 'build') ? "src/config/production.js" : "src/config/development.js"
    config.plugin("copy").tap(([pathConfigs]) => {
      pathConfigs.unshift({
        from: configFile,
        to: "js/config.js"
      });
      
      pathConfigs.unshift({
        from: "node_modules/canvas-confetti/dist",
        to: "js"
      });
      
      return [pathConfigs]})
  },
}