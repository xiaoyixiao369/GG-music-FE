<template>
<div>
  <mt-header fixed title="正在播放">
    <router-link to="/" slot="left">
      <mt-button icon="back">返回</mt-button>
    </router-link>
    <mt-button icon="more" slot="right"></mt-button>
  </mt-header>
  <div style="height: 40px;"></div>
  <div>
    <div style="margin-top: 30px;">
     <img id="avatar" :src="avatar"/>
    </div>
  </div>
  <div class="player-container">
    <audio class="player" autoplay :src="playUrl" controls></audio>
  </div>
  <div class="bg"></div>
</div>
</template>

<script>
import Vue from 'vue'
import { Button } from 'mint-ui'
Vue.component(Button.name, Button)
export default {
  created () {
  },
  data () {
    return {
      avatar: this.$route.query.avatar,
      playUrl: 'http://node.kg.qq.com/cgi/fcgi-bin/fcg_get_play_url?shareid=' + this.$route.query.shareid
    }
  }
}
</script>

<style>
.mint-header {
  background-color: #70727480;
}
.bg {
  background: url(../assets/gg-bg.png) center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-size: cover;
  filter: url(../assets/blur.svg#blur);
  -webkit-filter: blur(15px) brightness(0.6);
  -moz-filter: blur(15px) brightness(0.6);
  filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=10, MakeShadow=false); /* IE6~IE9 */
  z-index: -1000;
}
#avatar {
 border-radius: 50%;
 border: 8px solid #867f7f;
 width: 200px;
 height: 200px;
 margin: 0 auto;
 display: block;
 -webkit-animation:change 6s linear infinite;
}

@-webkit-keyframes change {
 0%{-webkit-transform:rotate(0deg);}
 10%{-webkit-transform:rotate(36deg);}
 20%{-webkit-transform:rotate(72deg);}
 30%{-webkit-transform:rotate(108deg);}
 40%{-webkit-transform:rotate(144deg);}
 50%{-webkit-transform:rotate(180deg);}
 60%{-webkit-transform:rotate(216deg);}
 70%{-webkit-transform:rotate(242deg);}
 80%{-webkit-transform:rotate(278deg);}
 90%{-webkit-transform:rotate(314deg);}
 100%{-webkit-transform:rotate(360deg);}
}
.player-container {
  bottom: -4px;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 1;
}
.player {
  width: 100%;
}
</style>
