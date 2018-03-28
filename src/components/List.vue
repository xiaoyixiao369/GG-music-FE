<template>
  <div class="page-tabbar">
    <div class="page-wrap">
      <mt-header fixed title="Gordon Music"></mt-header>
      <div style="height: 40px;"></div>

      <mt-tab-container class="page-tabbar-container" v-model="selected">
        <mt-tab-container-item id="songList">
          <div v-for="item in list" :key="item.shareid">
            <mt-cell :title="item.title === '' ? '-_-未获取到歌曲名称' : item.title" :to="`/song?shareid=${item.shareid}&avatar=${item.avatar}`" is-link>
              <img slot="icon" :src="item.avatar" width="24" height="24" style="border-radius: 50%;">
            </mt-cell>
          </div>
          <div style="margin-bottom: 60px; margin-top: 20px; text-align: center;">
            <mt-button size="small" type="default" v-if="showLoadMoreBtn" @click.native="loadMore">加载更多</mt-button>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="mine">
          <div style="text-align: center; margin-top: 20px;">
            <img style="border-radius: 50%; border: 4px solid rgba(77,78,84,0.46);" src="http://shp.qlogo.cn/ttsing/100267531/100267531/100?ts=0" alt="Gordon">
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <mt-badge type="primary">Gordon</mt-badge>
          </div>
          <p></p>
          <p></p>
          <h4>About Me:</h4>
          <p>A Web Developer in ChengDu, China</p>
          <p></p>
          <p></p>
          <h4>Contact Me:</h4>
          <p>Blog: <a href="https://igordonxiao.github.io/">https://igordonxiao.github.io/</a></p>
          <p>Twitter: <a href="https://twitter.com/igordonxiao">https://twitter.com/igordonxiao</a></p>
          <p>Github: <a href="https://github.com/igordonxiao">https://github.com/igordonxiao</a></p>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>

    <mt-tabbar v-model="selected" fixed>
      <mt-tab-item id="songList">
        <img slot="icon" src="../assets/icon-music.png">
        歌单
      </mt-tab-item>
      <mt-tab-item id="mine">
        <img slot="icon" src="../assets/icon-mine.png">
        我的
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
import Vue from 'vue'
import { Header, Tabbar, Cell, Toast, TabItem, Badge } from 'mint-ui'
import axios from 'axios'
Vue.component(Header.name, Header)
Vue.component(Tabbar.name, Tabbar)
Vue.component(TabItem.name, TabItem)
Vue.component(Cell.name, Cell)
Vue.component(Badge.name, Badge)
let page = 1
const size = 15
const BASE_DOMAIN = 'http://39.108.6.47:8080'

export default {
  name: 'App',
  created () {
    this.loadMore()
  },
  data () {
    return {
      list: [],
      showLoadMoreBtn: true,
      selected: 'songList'
    }
  },
  methods: {
    loadMore () {
      this.loading = false
      axios.get(BASE_DOMAIN + '/list', {
        params: {
          page: page++,
          size: size
        }
      }).then((res) => {
        const data = res.data
        const list = JSON.parse(data.substring(18, data.length - 1)).data.ugclist
        if (list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            this.list.push(list[i])
          }
          Vue.prototype.songList = this.list
        } else {
          Toast('没有更多歌曲了!')
          this.showLoadMoreBtn = false
        }
      }).catch((error) => {
        Toast(error)
      })
    }
  }
}
</script>

<style>
  .mint-header {
    background-color: #70727480;
  }
</style>
