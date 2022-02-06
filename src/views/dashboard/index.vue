<template>
  <div class="dashboard-container">
    <component :is="currentRole"></component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import { getLoginType } from '@/utils/auth'
import { setLoginType } from '@/utils/auth' // getToken from cookie
export default {
  name: 'dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'editorDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    const type = getLoginType()
    if (type == 1 || type == 3) {
      this.currentRole = 'editorDashboard'
    } else {
      if (window.location.host.includes('localhost')) { // 本地运行环境
        this.$alert('本地运行环境暂不支持登入商家系统', '提示', {
          confirmButtonText: '确定',
          center: true,
          callback: action => {
            this.$store.dispatch('LoginProxy', 0).then(res => {
              setLoginType(this.$store.getters.loginType)
              document.location.href = '/dashboard'
            }).catch(err => {
              console.log(err)
            })
          }
        })
        return
      }
      document.location.href = 'http://' + window.location.host + '/dashboard'
    }

    /*
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
    */
  }
}
</script>
<style lang="scss" scoped>
  .dashboard-container {
    overflow: hidden;
  }
</style>