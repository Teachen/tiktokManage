import myImage from './index.vue'
const elImage = {
  install(Vue) {
    Vue.component('elImage', myImage)
  }
}
export default elImage
