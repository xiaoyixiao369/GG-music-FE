<script>
import axios from 'axios'
import { Toast } from 'mint-ui'
const SONGLIST = []
let PAGE = 1
const SIZE = 15
const BASE_DOMAIN = 'http://39.108.6.47:8080'
// 我自己的歌单UID
let UID = '639d9d87232a328835'
// 演唱者信息
let SINGER = {
  name: '',
  img: '',
  level: '',
  songCount: ''
}
// 兼容其它全民用户的歌单UID
const search = window.location.search
if (search !== '') {
  const query = search.substring(1, search.length).split('=')
  if (query.length > 0) {
    const queryMap = new Map()
    for (let i = 0; i < query.length; i += 2) {
      queryMap.set(query[i], query[i + 1])
    }
    const customeUid = queryMap.get('uid')
    if (customeUid) UID = customeUid
  }
}

// 加载演唱者信息
axios.get(BASE_DOMAIN + '/songAuthor', {
  params: {
    uid: UID
  }
}).then((res) => {
  const data = res.data
  if (data) {
    SINGER.name = data.name
    SINGER.img = data.img
    SINGER.level = data.level
    SINGER.songCount = data.songCount
  }
}).catch((error) => {
  Toast(error)
})

export default {
  SONGLIST,
  PAGE,
  SIZE,
  BASE_DOMAIN,
  UID,
  SINGER
}
</script>
