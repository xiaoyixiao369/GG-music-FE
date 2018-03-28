<template>
    <div>
      <div>
        <mt-header fixed title="固定在顶部"></mt-header>
        <div style="height: 40px;"></div>
        <div v-for="item in list" :key="item.shareid">
          <mt-cell :title="item.title === '' ? '-_-未获取到歌曲名称' : item.title" :to="`/song?shareid=${item.shareid}`" is-link>
            <img slot="icon" :src="item.avatar" width="24" height="24" style="border-radius: 50%;">
          </mt-cell>
        </div>
        <div style="margin-bottom: 60px;">
          <mt-button style="width: 100%;" v-if="showLoadMoreBtn" type="default" @click.native="loadMore">加载更多</mt-button>
        </div>
      </div>
      <mt-tabbar v-model="selected" fixed>
        <mt-tab-item id="songList">
          <img slot="icon" src="">
          歌单
        </mt-tab-item>
        <mt-tab-item id="mine">
          <img slot="icon" src="">
          我的
        </mt-tab-item>
      </mt-tabbar>
    </div>
</template>

<script>
import Vue from 'vue'
import { Header, Tabbar, Cell, Toast, TabItem } from 'mint-ui'
import axios from 'axios'
Vue.component(Header.name, Header)
Vue.component(Tabbar.name, Tabbar)
Vue.component(TabItem.name, TabItem)
Vue.component(Cell.name, Cell)
let page = 1
const size = 10
export default {
  name: 'App',
  created () {
    this.loadMore()
  },
  data () {
    return {
      list: [],
      showLoadMoreBtn: true,
      selected: true
    }
  },
  methods: {
    loadMore () {
      this.loading = false
      axios.get('http://localhost:8080/list', {
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

</style>
