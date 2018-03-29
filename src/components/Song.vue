<template>
<div>
  <mt-header fixed :title="`${songInfo.song_name}`">
    <router-link to="/" slot="left">
      <mt-button icon="back">返回</mt-button>
    </router-link>
  </mt-header>
  <div style="height: 40px;"></div>
  <div style="height: 40px; text-align: center; color: #d9d9d9;">- {{songInfo.kg_nick}} -</div>
  <p style="color: #ffffffc7;text-align: center; font-size: 0.8rem;">{{songInfo.content}}</p>
  <div>
    <div style="margin-top: 50px;">
     <img id="avatar" :src="songInfo.cover"/>
    </div>
  </div>
  <div id="lyricContainer" style="height: 110px; color:white; text-align: center; overflow-y: scroll; margin-top: 20px; padding:0;" v-html="lyricsLines">
  </div>
  <div class="player-container">
    <audio id="audioPlayer" class="player" autoplay :src="songInfo.playurl" controls></audio>
  </div>
  <div class="bg"></div>
</div>
</template>

<script>
import Vue from 'vue'
import global from '@/components/Global'
import axios from 'axios'
import { Button, Indicator } from 'mint-ui'
import '../utils/lyrics'
Vue.component(Button.name, Button)

export default {
  created () {
    Indicator.open('加载歌曲中...')
    axios.get(global.BASE_DOMAIN + '/song', {
      params: {
        shareId: this.$route.query.shareid
      }
    }).then((res) => {
      const data = res.data
      this.songInfo = JSON.parse(data.substring(14, data.length - 1)).data
      Indicator.close()
      // 加载歌词
      axios.get(global.BASE_DOMAIN + '/songLyric', {
        params: {
          ksongmid: this.songInfo.ksong_mid
        }
      }).then((res) => {
        // 处理歌词
        const lyric = res.data.data.lyric
        this.lyric = lyric
        const lrc = new window.Lyrics(lyric)
        let lyricsLines = []
        for (let k = 0; k < lrc.lyrics_all.length; k++) {
          const lyric = lrc.lyrics_all[k]
          if (lyric.text !== undefined && lyric.text !== '') {
            lyricsLines.push('<p timestamp="' + lyric.timestamp + '">' + lyric.text + '</p>')
          }
        }
        this.lyricsLines = lyricsLines.join('')
        const lyricContainer = document.getElementById('lyricContainer')
        document.getElementById('audioPlayer').addEventListener('timeupdate', function () {
          const lyricSelected = lrc.select(this.currentTime)
          if (lyricSelected !== undefined) {
            const selectedMetaLyric = lrc.getLyric(lyricSelected)
            if (selectedMetaLyric) {
              const lines = lyricContainer.querySelectorAll('p')
              for (let j = 0; j < lines.length; j++) {
                if (lines[j].getAttribute('timestamp') === selectedMetaLyric.timestamp + '') {
                  lines[j].className = 'lyric-active'
                  if (selectedMetaLyric.text.length > 0) {
                    let y = (j - 1) * 26
                    if (j % 3 === 0) {
                      y = y + 26
                    }
                    if (y > 2) lyricContainer.scrollTo(0, y - 30)
                  }
                } else {
                  lines[j].className = ''
                }
              }
            }
          }
        })
      }).catch((error) => {
        Indicator.close()
        console.log(error)
      })
    }).catch((error) => {
      Indicator.close()
      console.log(error)
    })
  },
  data () {
    return {
      songInfo: {},
      lyricsLines: '歌词加载中...',
      popupVisible: false
    }
  },
  methods: {
    getMoreInfo () {
      this.popupVisible = true
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
  filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=10, MakeShadow=false);
  z-index: -1000;
}
#avatar {
 border-radius: 50%;
 border: 5px solid #867f7f;
 width: 240px;
 height: 240px;
 margin: 0 auto;
 display: block;
 animation: change 6s linear infinite;
 -webkit-animation: change 6s linear infinite;
 -moz-animation: change 6s linear infinite;
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
.lyric-active {
  color: #727aff;
}
#lyricContainer>p {
  margin: 2px 0;
  height: 26px;
  padding: 0;
}
#lyricContainer::-webkit-scrollbar {
  display: none;
}
</style>
