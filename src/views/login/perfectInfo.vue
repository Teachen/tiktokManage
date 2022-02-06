<template>
  <div class="app-wrapper">
    <div class="main-container" v-loading="fullscreenLoading">
      <div class="nav-box">
        <!-- 导航logo -->
        <router-link to="/dashboard" tag="div" class="nav-box-logo pointer">
            <img src="../../assets/logo/logo-icon.svg" alt="">
            创客匠人
        </router-link>

        <!-- 导航信息 -->
        <div class="nav-box-inf height50 clearfix">
          <span style="color:#559EF8;" class="fr margin-r30 c-line50 c-fs-14">
          欢迎您，
          {{registerForm.companyName}}
          </span>
          <!-- <navbar :showLeftMenu="false"></navbar> -->
        </div>

      </div>
      <div style="height:calc(100% - 50px);background:#F5F7FA;" class="c-flex-column c-justify-center c-aligni-center relative">
        <div class="width800 height400 c-bg-white pefectInfoBox">
          <p class="c-fs-16 c-textAlign-c c-pv40 font-bold">
            完善以下信息，创客匠人为您提供更好的服务！
          </p>
            <el-form :model="registerForm"
              :rules="rules"
              ref="registerForm"
              v-loading="loading"
              label-position="right"
              label-width="260px">
              <el-form-item class="input" prop="companyName" label="平台名称：">
                <el-input autocomplete="off" class="width360" name="shopName" v-model="registerForm.companyName"
                          placeholder="平台名称"></el-input>
                <span>
                  {{registerForm.companyName.length}}/20
                </span>
              </el-form-item>
              <el-form-item class="input2" prop="companyParentTypeId" label="行业类别：">

                  <el-select  class="width175 fl margin-r10"  v-model="registerForm.companyParentTypeId" clearable
                            @change="selectParent" placeholder="一级行业类别">
                    <el-option v-for="item in companyParentType" :key="item.classId" :label="item.className" :value="item.classId"></el-option>
                  </el-select>

                  <el-select  class="width175 fl"   clearable v-model.number="registerForm.companyChildrenTypeId"
                            @change="selectChild"
                            placeholder="二级行业类别"
                  >
                    <el-option v-for="item in childType" :key="item.classId" :label="item.className"
                              :value="item.classId"></el-option>
                  </el-select>

              </el-form-item>

              <el-form-item class="input2" prop="baseProvinceId" label="公司地址：">
                <el-row>
                  <el-select class="width175 fl margin-r10"   clearable v-model="registerForm.baseProvinceId" @change="areaChange" placeholder="选择省">
                    <el-option v-for="item in provinceList" :key="item.areaId" :label="item.name" :value="item.areaId">
                    </el-option>
                  </el-select>
                  <el-select  class="width175 fl" clearable v-model="registerForm.baseCityId" @change="areaChange" placeholder="选择市">
                    <el-option v-for="item in cityList" :key="item.areaId" :label="item.name" :value="item.areaId">
                    </el-option>
                  </el-select>
                </el-row>
              </el-form-item>
              <div class="c-textAlign-c">
                <el-button class="width180 save_btn" :class="{'active':canSubmit
                }" type="primary" @click="register">
                  完成
                </el-button>
              </div>
            </el-form>
        </div>
        <p class="c-fc-666 absolute c-width100 c-fs-14 c-textAlign-c" style="bottom:30px;">
           ——  知识付费，用创客匠人 ——
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { Navbar } from '@/views/layout/components'
import { getAreaList } from '@/api/common'
import { childTypeListR, companyTypeListR, updateCompanyInfo } from '@/api/wechatPublic'
import { mapGetters } from 'vuex'

export default {
  name: 'perfectInfo',
  components: { Navbar },
  computed: {
    ...mapGetters([
      'companyInfo',
      'companyTypeInfo'
    ]),
    canSubmit() {
      // registerForm: {
      //     companyName: '',
      //     companyParentTypeId: null,
      //     companyChildrenTypeId: null,
      //     baseProvinceId: null,
      //     baseCityId: null
      //   }
      let result = true
      for (const i in this.registerForm) {
        if (this.registerForm[i] == null) {
          result = false
        }
      }
      return result
    }
  },
  data() {
    const validateCompanyName = (rule, value, callback) => {
      if (!value || value.trim() == '') {
        callback(new Error('请输入平台名称'))
      }
      if (value.length > 20) {
        callback(new Error('平台名称最多20个字'))
      } else {
        callback()
      }
    }
    return {
      fullscreenLoading: false,
      companyParentType: [],
      childType: [],
      provinceList: [],
      cityList: [],
      registerForm: {
        companyName: '',
        companyParentTypeId: null,
        companyChildrenTypeId: null,
        baseProvinceId: null,
        baseCityId: null
      },
      rules: {
        companyName: [{ required: true, trigger: 'blur', validator: validateCompanyName }],
        companyParentTypeId: [{ required: true, message: '请选择行业分类', trigger: 'change' }],
        baseProvinceId: [{ required: true, message: '请选择公司地址', trigger: 'change' }]
      }
    }
  },
  created() {
    const { companyInfo = {}} = this
    if (Object.keys(companyInfo).length > 0) {
      const { baseCityId, baseProvinceId, companyName } = this.companyInfo
      const { companyChildrenTypeId, companyParentTypeId } = this.companyTypeInfo
      this.registerForm = {
        companyName,
        companyParentTypeId,
        companyChildrenTypeId,
        baseProvinceId,
        baseCityId
      }
    }
    if (this.$route.params.companyId) {
      this.registerForm.companyName = this.$route.params.companyName
      this.registerForm.companyId = this.$route.params.companyId
    }
    console.log(this.$route.params, 999999)
    this.getAreaList()
    this.getcompanyTypeListR()
  },
  methods: {
    selectParent(val) {
      this.childType = []
      this.registerForm.companyChildrenTypeId = ''
      if (!val) {
        return
      }
      this.getchildTypeListR(val)
    },
    selectChild() {
      this.$forceUpdate()
    },
    getAreaList() {
      getAreaList().then(res => {
        this.provinceList = res.data.data.data
      }).catch(err => {
        console.log(err)
      })
    },
    areaChange(val, isfre = true) {
      if (!val) {
        this.cityList = []
        this.registerForm.baseCityId = null
        return false
      }
      getAreaList(val).then(res => {
        if (res.data.data.level == 2) {
          if (isfre) {
            this.registerForm.baseCityId = null
          }
          this.cityList = res.data.data.data
        } else if (res.data.data.level == 3) {
          this.areaList = res.data.data.data
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getcompanyTypeListR() {
      companyTypeListR({ type: 2 }).then(res => {
        this.companyParentType = res.data.data
      })
    },
    getchildTypeListR(id) {
      childTypeListR(id).then(res => {
        this.childType = res.data.data
      })
    },
    register() {
      // var data = {
      //   companyName: this.registerForm.companyName,
      //   companyParentTypeId: this.registerForm.companyParentTypeId,
      //   companyChildrenTypeId: this.registerForm.companyChildrenTypeId,
      //   baseProvinceId: this.registerForm.baseProvinceId,
      //   baseCityId: this.registerForm.baseCityId
      // }
      const data = this.registerForm
      this.$refs.registerForm.validate(valid => {
        if (!this.registerForm.companyParentTypeId) {
          this.$message({
            message: '请选择一级行业类别',
            type: 'info'
          })
          return
        }
        if (!this.registerForm.companyChildrenTypeId) {
          this.$message({
            message: '请选择二级行业类别',
            type: 'info'
          })
          return
        }
        if (!this.registerForm.baseProvinceId) {
          this.$message({
            message: '请选择省',
            type: 'info'
          })
          return
        }
        if (!this.registerForm.baseCityId) {
          this.$message({
            message: '请选择市',
            type: 'info'
          })
          return
        }
        if (valid) {
          if (this.fullscreenLoading) {
            return
          }
          this.fullscreenLoading = true
          updateCompanyInfo(data).then(res => {
            console.log('注册', res)
            if (res.data.statusCode == 200) {
              this.fullscreenLoading = false
              this.$message.success('完善信息成功')
            }
            this.$store.commit('SET_IS_PERFECT_INFO', true)
            this.$router.push({ path: '/login' })
          }).catch(() => {
            this.fullscreenLoading = false
          })
        } else {
          return false
        }
        // this.$router.push({path:'/dashboard'})
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .width800 {
    width: 800px;
  }
  .save_btn{
    background-color: rgba(82, 159, 238, .3);
    border: 0;
    &.active{
      background-color: #529fee;
    }
  }
  .c-line50{
    line-height: 50px;
  }
  .el-form-item{
    margin-bottom: 30px !important;
  }
  .width360{
    width: 360px;
  }
  .width175{
    width: 175px;
  }
  .pefectInfoBox{
    background:rgba(255,255,255,1);
    box-shadow:0px 6px 6px rgba(204,204,204,0.2);
    border-radius:4px;

  }
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    .main-container {
      min-width: 1024px;
      >.nav-box {
        @include clearfix;
        >.nav-box-logo{
          width: 180px;
          height: 50px;
          line-height: 50px;
          // text-align: center;
          padding-left: 20px;
          text-align: left;
          // float: left;
          position: absolute;
          z-index: 10;
          background: #fff;
          &::after{
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            height: 10px;
            width: 1px;
            background: #EDEDED;
          }
          // box-shadow:0px 3px 5px 0px rgba(85,158,248,0.1);
          >img{
            display: inline-block;
            vertical-align: middle;
            width: 24px;
            height: 24px;
          }
        }
        >.nav-box-info{
          width: calc(100% - 180px);
          position: relative;
          z-index: 11;
          // float: right;
          float: right;
          // box-shadow:0px 3px 5px 0px rgba(85,158,248,0.1);
        }
        >.nav-box-info.open{
          width: 100%;
          // float: right;
          // box-shadow:0px 3px 5px 0px rgba(85,158,248,0.1);
        }
      }

    }
  }

  // .app-wrapper .main-container {
  //   min-width: 1024px;
  // }
</style>
