<template>
<div class="song-detail">
  <mt-header fixed :title="`${songInfo.song_name}`">
    <router-link to="/" slot="left">
      <mt-button icon="back">返回</mt-button>
    </router-link>
  </mt-header>
  <div style="height: 40px;"></div>
  <div style="height: 36px; text-align: center; color: #d9d9d9;">- {{songInfo.kg_nick}} -</div>
  <div style="color: #ffffffc7;text-align: center; font-size: 0.8rem;">{{songInfo.content}}</div>
  <div>
    <div style="margin-top: 20px;">
     <img id="avatar" :src="songInfo.cover" :class="{'rotate-style': isRotate}"/>
    </div>
  </div>
  <div id="lyricContainer" style="height: 80px; color:white; text-align: center; overflow-y: scroll; margin-top: 20px; padding:0;" v-html="lyricsLines">
  </div>
  <div class="player-container">
    <audio id="audioPlayer" class="player" autoplay :src="songInfo.playurl" controls></audio>
  </div>
  <div class="player-controll">
    <div class="mint-tabbar">
      <a id="playPrevBtn" class="mint-tab-item">
        <div class="mint-tab-item-icon">
          <img src="../assets/prev.png">
        </div>
        <div class="mint-tab-item-label">
        </div>
      </a>
      <a id="playBtn" class="mint-tab-item">
        <div class="mint-tab-item-icon">
          <img v-if="pause" src="../assets/play.png">
          <img v-if="play" src="../assets/pause.png">
        </div> <div class="mint-tab-item-label">
      </div>
      </a>
      <a id="playNextBtn" class="mint-tab-item">
        <div class="mint-tab-item-icon">
          <img src="../assets/next.png">
        </div> <div class="mint-tab-item-label">
      </div>
      </a>
    </div>
  </div>
  <div class="bg" v-bind:style="{backgroundImage: 'url(' + songInfo.cover + ')'}"></div>
  <router-view/>
</div>
</template>

<script>
import Vue from 'vue'
import global from '@/components/Global'
import axios from 'axios'
import { Button, Indicator, Toast } from 'mint-ui'
import '../utils/lyrics'
Vue.component(Button.name, Button)

export default {
  mounted () {
    this.player = document.getElementById('audioPlayer')
    this.avatar = document.getElementById('avatar')
  },
  created () {
    this.loadSong()
  },
  data () {
    return {
      songInfo: {},
      payer: {},
      avatar: {},
      play: true,
      pause: false,
      lyricsLines: '歌词加载中...',
      popupVisible: false,
      isRotate: false
    }
  },
  methods: {
    getMoreInfo () {
      this.popupVisible = true
    },
    loadSong () {
      const that = this
      // 控制播放上一首或下一首 ture: 下一首 false: 下一首
      function playCtl (prevOrNext) {
        const list = []
        let songs = global.SONGLIST
        for (let w = 0; w < songs.length; w++) {
          list.push(songs[w].shareid)
        }
        const curSongIndex = list.findIndex(function (value, index, arr) {
          return value === that.$route.query.shareid
        })
        if (curSongIndex < list.length) {
          const newIdx = prevOrNext ? curSongIndex + 1 : curSongIndex - 1
          if (list[newIdx]) {
            that.$router.push('/song?shareid=' + list[newIdx])
          } else {
            Toast('没有歌曲了')
          }
        }
      }
      Indicator.open('加载歌曲中...')
      axios.get(global.BASE_DOMAIN + '/song', {
        params: {
          shareId: that.$route.query.shareid
        }
      }).then((res) => {
        that.isRotate = true
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
          that.player.addEventListener('timeupdate', function () {
            const lyricSelected = lrc.select(this.currentTime)
            if (lyricSelected !== undefined) {
              const selectedMetaLyric = lrc.getLyric(lyricSelected)
              if (selectedMetaLyric) {
                const lines = lyricContainer.querySelectorAll('p')
                for (let j = 0; j < lines.length; j++) {
                  if (lines[j].getAttribute('timestamp') === selectedMetaLyric.timestamp + '') {
                    lines[j].className = 'lyric-active'
                    if (j > 1) {
                      lyricContainer.scrollTo(0, (Math.floor((lyricContainer.scrollHeight + 40) / lines.length) * (j - 1)))
                    }
                  } else {
                    lines[j].className = ''
                  }
                }
              }
            }
          })
          // 播放结束
          that.player.addEventListener('ended', function () {
            lyricContainer.scrollTo(0, 0)
            that.isRotate = false
            playCtl(true)
          })
          // 播放上一首
          document.getElementById('playPrevBtn').addEventListener('click', function (e) {
            playCtl(false)
            that.play = true
            that.pause = false
            e.preventDefault()
            e.stopImmediatePropagation()
            e.stopPropagation()
          })
          // 播放或暂停
          document.getElementById('playBtn').addEventListener('click', function (e) {
            if (that.player.paused) {
              that.play = true
              that.pause = false
              that.player.play()
              that.isRotate = true
            } else {
              that.play = false
              that.pause = true
              that.player.pause()
              that.isRotate = false
              that.avatar.style.transform = 'rotate(' + Math.floor(Math.random() * 360) + 'deg)'
            }
            e.preventDefault()
            e.stopImmediatePropagation()
            e.stopPropagation()
          })
          // 播放下一首
          document.getElementById('playNextBtn').addEventListener('click', function (e) {
            playCtl(true)
            that.play = true
            that.pause = false
            e.preventDefault()
            e.stopImmediatePropagation()
            e.stopPropagation()
          })
        }).catch((error) => {
          Indicator.close()
          console.log(error)
        })
      }).catch((error) => {
        Indicator.close()
        console.log(error)
      })
    }
  },
  watch: {
    '$route' (to, from) {
      this.loadSong()
    }
  }
}
</script>

<style>
.song-detail .mint-header {
  background-color: #70727480;
}
.song-detail .mint-tabbar {
  background-size: 100% 0;
  background-color: #fafafae3;
}
.song-detail .mint-tab-item {
  padding: 20px 0;
}
.song-detail .mint-tab-item-icon {
  width: 28px;
  height: 28px;
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
 width: 200px;
 height: 200px;
 margin: 0 auto;
 display: block;
}
.rotate-style {
  animation: rotate 6s linear infinite;
  -webkit-animation: rotate 6s linear infinite;
  -moz-animation: rotate 6s linear infinite;
}

@-webkit-keyframes rotate {
 0%{-webkit-transform: rotate(0deg);}
 10%{-webkit-transform: rotate(36deg);}
 20%{-webkit-transform: rotate(72deg);}
 30%{-webkit-transform: rotate(108deg);}
 40%{-webkit-transform: rotate(144deg);}
 50%{-webkit-transform: rotate(180deg);}
 60%{-webkit-transform: rotate(216deg);}
 70%{-webkit-transform: rotate(242deg);}
 80%{-webkit-transform: rotate(278deg);}
 90%{-webkit-transform: rotate(314deg);}
 100%{-webkit-transform: rotate(360deg);}
}
.player-container {
  bottom: -4px;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 1;
  display: none;
}
.player {
  width: 100%;
}
.lyric-active {
  color: #9e7bff;
  font-size: 120%;
  background-color: rgba(107, 107, 107, 0.5);
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
