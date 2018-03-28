<template>
  <div>
    <mt-header title="正在播放">
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button icon="more" slot="right"></mt-button>
    </mt-header>
    <audio autoplay :src="playUrl" controls></audio>
    <router-view/>
  </div>
</template>

<script>
import Vue from 'vue'
import { Button } from 'mint-ui'
Vue.component(Button.name, Button)
export default {
  mounted () {
    this.playUrl = 'http://node.kg.qq.com/cgi/fcgi-bin/fcg_get_play_url?shareid=' + this.$route.query.shareid
  },
  data () {
    return {
      playUrl: 'http://node.kg.qq.com/cgi/fcgi-bin/fcg_get_play_url?shareid=' + this.$route.query.shareid
    }
  }
}
</script>
