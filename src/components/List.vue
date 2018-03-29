<template>
  <div class="page-tabbar">
    <div class="page-wrap">
      <mt-header fixed :title="`${singer.name} Music`">
        <mt-button icon="more" slot="right" @click="singerInfo"></mt-button>
      </mt-header>
      <div style="height: 40px;"></div>

      <mt-tab-container class="page-tabbar-container" v-model="selected">
        <mt-tab-container-item id="menuSongList">
          <div v-for="item in list" :key="item.shareid">
            <mt-cell :title="item.title === '' ? '-_-未获取到歌曲名称' : item.title" :to="`/song?shareid=${item.shareid}`" is-link>
              <img slot="icon" :src="item.avatar" width="24" height="24" style="border-radius: 50%;">
            </mt-cell>
          </div>
          <div style="margin-bottom: 60px; margin-top: 20px; text-align: center;">
            <mt-button size="small" type="default" v-if="showLoadMoreBtn" @click.native="loadMore">加载更多</mt-button>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="menuMine">
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
      <mt-tab-item id="menuSongList">
        <img slot="icon" src="../assets/icon-music.png">
        歌单
      </mt-tab-item>
      <mt-tab-item id="menuMine">
        <img slot="icon" src="../assets/icon-mine.png">
        作者
      </mt-tab-item>
    </mt-tabbar>
    <mt-popup
      v-model="popupVisible"
      popup-transition="popup-fade">
      <div style="width: 600px;text-align: center; padding: 40px 20px;color: rgba(0, 0, 0, 0.6);">
        <div>
          <img :src="singer.img" alt="" style="border: 6px solid ghostwhite; border-radius: 50%;">
        </div>
        <p>{{singer.songCount}}</p>
        <p>{{singer.level}}</p>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import Vue from 'vue'
import { Header, Tabbar, Cell, Toast, TabItem, Badge, Indicator, Popup } from 'mint-ui'
import axios from 'axios'
import global from '@/components/Global'
Vue.component(Header.name, Header)
Vue.component(Tabbar.name, Tabbar)
Vue.component(TabItem.name, TabItem)
Vue.component(Cell.name, Cell)
Vue.component(Badge.name, Badge)
Vue.component(Popup.name, Popup)

export default {
  name: 'App',
  created () {
    setTimeout(() => {
      this.showLoadMoreBtn = true
    }, 1000)
  },
  data () {
    return {
      popupVisible: false,
      singer: global.SINGER,
      list: global.SONGLIST,
      showLoadMoreBtn: false,
      selected: 'menuSongList'
    }
  },
  methods: {
    loadMore () {
      Indicator.open('加载歌曲中...')
      axios.get(global.BASE_DOMAIN + '/list', {
        params: {
          uid: global.UID,
          page: ++global.PAGE,
          size: global.SIZE
        }
      }).then((res) => {
        const data = res.data
        const list = JSON.parse(data.substring(18, data.length - 1)).data.ugclist
        if (list && list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            global.SONGLIST.push(list[i])
          }
        } else {
          Toast('没有更多歌曲了!')
          this.showLoadMoreBtn = false
        }
        Indicator.close()
      }).catch((error) => {
        Indicator.close()
        Toast(error)
      })
    },
    singerInfo () {
      this.popupVisible = true
    }
  }
}
</script>

<style>
  .mint-header {
    background-color: rgba(0, 0, 0, 0.78);
  }
</style>
