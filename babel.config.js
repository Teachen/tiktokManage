const plugins = ["@vue/babel-plugin-transform-vue-jsx", "@babel/plugin-syntax-dynamic-import"]
// 生产环境移除console
if(process.env.NODE_ENV === 'production') {
  plugins.push(["transform-remove-console", { "exclude": [ "error", "warn"] }])
}
module.exports = {
  plugins: plugins,
  presets: [
    '@vue/app'
  ]
}
