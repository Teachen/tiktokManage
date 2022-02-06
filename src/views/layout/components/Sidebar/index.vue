<template>
      <scroll-bar>
        <div style="position:relative;"> 
          <el-menu ref="menu" mode="vertical" @open="open" @close="close" :default-active="$route.path" :collapse="isCollapse" background-color="#303945" text-color="#bfcbd9" active-text-color="#409EFF">
            <div class="c-textAlign-r padding-r10 padding-t10" style="font-size:0;" @click.prevent="switchMenu">
                <img class="ib margin-r10 width10 pointer" :class="switchStatus?'switch-active':''" style="vertical-align: text-bottom;" src="../../../../assets/icon/switch.png">
            </div>
            <sidebar-item :routes="permission_routers"></sidebar-item>
          </el-menu>
        </div>
      </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
export default {
  components: { SidebarItem, ScrollBar },
  data() {
    return {
      openMenu: [],
      switchStatus: false,
      isAllClose: true
    }
  },
  created() {
    this.navfn(this.permission_routers)
    this.$nextTick(() => {
      this.$store.commit('SET_LEFTMENU', this.$refs.menu)
      this.$store.commit('SET_MENULIST', this.openMenu)
    })
  },
  watch: {
    // 'noviceGuidance.exit': {
    //   handler: function(val, oldVal) {
    //     if (this.noviceGuidance.exit == true && this.noviceGuidance.step == 1) {
    //       if (this.openMenu.includes()) {
    //         this.$refs.menu[open]()
    //       }
    //     }
    //   },
    //   deep: true
    // }
  },
  methods: {
    open(index) {
      console.log(10086)
      // console.log(arguments)
      if (~this.openMenu.indexOf(index) == 0) {
        this.openMenu.push(index)
      }
      this.switchStatus = true
    },
    close(index) {
      console.log('触发了关闭')
      // this.openMenu.splice(index, 1)
      // if (this.openMenu.length == 0) {
      //   this.switchStatus = false
      // }
    },
    hasOneShowingChildren(children) {
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    },
    navfn(arr) {
      const menuarr = arr.filter(item => !item.hidden)
      menuarr.forEach(item => {
        if (item.children && item.children.length > 1 && item.name) {
          // console.log(item.name)
          // this.$refs.menu.open(item.name)
          let nums = 0
          item.children.map((i) => {
            if (i.hidden == true) {
              nums++
            }
          })
          if (nums < item.children.length - 1) {
            this.openMenu.push(item.name || item.path)
            if (item.children) {
              this.navfn(item.children)
            }
          }
        }
      })
      // menuarr = menuarr.filter((item) => {
      //   return item
      // })
    },
    switchMenu() {
      // if (this.openMenu.length <= 0) {
      //   return
      // }
      console.log(this.openMenu)
      let switchFn = 'open'
      if (this.switchStatus) {
        switchFn = 'close'
      }
      this.switchStatus = !this.switchStatus

      for (var i = 0; i < this.openMenu.length; i++) {
        console.log(this.openMenu[i])
        this.$refs.menu[switchFn](this.openMenu[i])
      }
    }
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar',
      'noviceGuidance'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style scoped>
.width10 {
  width: 10px;
}
.switch-active{
  transform: rotate(90deg);
}
</style>

