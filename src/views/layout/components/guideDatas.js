
import {
  enableModules,
  allPermission
} from '@/utils/permission'
export default{
  computed: {
    guideData() {
      const guideData = [{
        name: '新品发布',
        children: [
          {
            name: '创建视频',
            key: 'videos',
            openRule: false,
            showRule: allPermission().knowledge_courses_videos.length == 3
          },
          {
            name: '创建音频',
            key: 'audios',
            openRule: false,
            showRule: allPermission().knowledge_courses_audios.length == 3
          },
          {
            name: '创建图文',
            key: 'articles',
            openRule: false,
            showRule: allPermission().knowledge_courses_articles.length == 3
          },
          {
            name: '创建直播',
            key: 'liveManage',
            openRule: false,
            showRule: enableModules().enableTeleviseLive == 1
          }
          // {
          //   name: '创建专栏',
          //   key: 'knowledgProduct',
          //   openRule: false,
          //   showRule: true
          // },
          // {
          //   name: '创建知识套餐',
          //   key: 'knowledgProduct',
          //   openRule: false,
          //   showRule: true
          // }
        ]
      },
      // {
      //   name: '店铺管理',
      //   children: [
      //     {
      //       name: '基础资料',
      //       key: '',
      //       openRule: false,
      //       showRule: true
      //     },
      //     {
      //       name: '店铺装修',
      //       key: '',
      //       openRule: false,
      //       showRule: true
      //     }
      //   ]
      // },
      {
        name: '支付交易',
        children: [
          {
            name: '订单管理',
            key: 'orderIndex',
            openRule: false,
            showRule: true
          },
          {
            name: '收益查询及提现',
            key: 'financed',
            openRule: false,
            showRule: true
          }
        ]
      },
      {
        name: '营销工具',
        children: [
          {
            name: '限时折扣',
            key: 'timePurchase',
            openRule: false,
            showRule: enableModules.enableFlashSalesModule == 1
          },
          {
            name: '拼团',
            key: '',
            openRule: false,
            showRule: true
          }
        ]
      },
      {
        name: '社群督学',
        children: [
          // {
          //   name: '测评',
          //   key: '',
          //   openRule: false,
          //   showRule: true
          // },
          // {
          //   name: '打卡',
          //   key: '',
          //   openRule: false,
          //   showRule: true
          // },
          {
            name: '社群',
            key: 'social',
            openRule: false,
            showRule: enableModules.enableSocialGroup == 1
          }
          // {
          //   name: '活动',
          //   key: 'actives',
          //   openRule: false,
          //   showRule: enableModules.enableSocialGroup == 1
          // }
        ]
      }
      // {
      //   name: '内容分销',
      //   children: [
      //     {
      //       name: '内容分销市场',
      //       key: 'mallIndex',
      //       openRule: false,
      //       showRule: true
      //     }
      //   ]
      // },
      // {
      //   name: '用户管理',
      //   children: [
      //     {
      //       name: '用户列表',
      //       key: '',
      //       openRule: false,
      //       showRule: true
      //     },
      //     {
      //       name: '会员',
      //       key: '',
      //       openRule: false,
      //       showRule: true
      //     },
      //     {
      //       name: '服务商',
      //       key: '',
      //       openRule: false,
      //       showRule: true
      //     }
      //   ]
      // }
      ]
      return guideData
    }
  }
}
