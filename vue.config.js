module.exports = {
  devServer:{
    https: true,
    public: "https://localhost:8080"
  },
  chainWebpack(config) {
    config.resolve.alias.delete("@")
    config.resolve
      .plugin("tsconfig-paths")
      .use(require("tsconfig-paths-webpack-plugin"))
  },
  }