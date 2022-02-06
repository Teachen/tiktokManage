import myEye from './index.vue'
const elEye = {
  install(Vue) {
    Vue.component('elEye', myEye)
  }
}
export default elEye
