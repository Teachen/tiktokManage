import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: Cookies.get('sidebarStatus')
    },
    language: Cookies.get('language') || 'en',
    sortBy: Cookies.get('sortStatus') || 'time',
    serviceName: '',
    names: {
      agentName: '',
      partnerName: '',
      branchName: ''
    },
    previewData: [],
    // 是否选中线上付费
    onLinePayment: 0,
    isMoney: 1
  },
  mutations: {
    TOGGLE_SORTBY: state => {
      if (state.sortBy == 'time') {
        state.sortBy = 'phone'
        Cookies.set('sortStatus', 'phone', { secure: document.location.protocol == 'https:' })
      } else {
        state.sortBy = 'time'
        Cookies.set('sortStatus', 'time', { secure: document.location.protocol == 'https:' })
      }
    },
    CLOSE_SIDEBAR: state => {
      state.sidebar.opened = 0
      Cookies.set('sidebarStatus', 0, { secure: document.location.protocol == 'https:' })
    },
    OPEN_SIDEBAR: state => {
      state.sidebar.opened = 1
      Cookies.set('sidebarStatus', 1, { secure: document.location.protocol == 'https:' })
    },
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1, { secure: document.location.protocol == 'https:' })
      } else {
        Cookies.set('sidebarStatus', 0, { secure: document.location.protocol == 'https:' })
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      Cookies.set('language', language, { secure: document.location.protocol == 'https:' })
    },
    SET_PREVIEW_DATA: (state, data) => {
      state.previewData = data.slice(0, data.length)
    },
    // 是否选入线上付费   onLinePayment
    SET_ONLINE_PAYMENT: (state, data) => {
      state.onLinePayment = data
    },
    SET_SERVICE_NAME: (state, serviceName) => {
      if (serviceName) {
        state.serviceName = serviceName
        Cookies.set('serviceName', serviceName, { secure: document.location.protocol == 'https:' })
      } else {
        state.serviceName = '服务商'
      }
    },
    SET_NAMES: (state, payload) => {
      state.names = payload
    },
    SET_IS_MONEY: (state, isMoney) => {
      state.isMoney = isMoney
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    toggleSortStatues({ commit }) {
      commit('TOGGLE_SORTBY')
    },
    setPreviewData({ commit }, data) {
      commit('SET_PREVIEW_DATA', data)
    },
    // 是否选中线上付费
    setonlinePayment({ commit }, data) {
      console.log(data)
      commit('SET_ONLINE_PAYMENT', data)
    },
    setServiceName({ commit }, serviceName) {
      commit('SET_SERVICE_NAME', serviceName)
    },
    setNames({ commit }, payload) {
      commit('SET_NAMES', payload)
    },
    setIsMoney({ commit }, isMoney) {
      commit('SET_IS_MONEY', isMoney)
    }
  }
}

export default app
