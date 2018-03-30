# GG-Music

> 全民K歌播放器 Build with Vue.js

在线体验: [http://39.108.6.47/](http://39.108.6.47/) or [www.ggmusic.ml](http://www.ggmusic.ml/)    

Github: [https://github.com/igordonxiao/GG-music-FE](https://github.com/igordonxiao/GG-music-FE)

## 编译

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## 功能
+ 获取全民K歌用户信息
+ 获取用户歌曲列表
+ 播放歌曲(包含暂停、上一曲、下一曲、歌词同步显示)
+ 当前歌曲播放完毕自动播放下一曲


## 使用
+ 直接部署为`http://localhost:8000`时, 加载的歌曲列表即为笔者的
+ 访问他人的歌单的连接为`http://localhost:8000?uid=XXXXXXXXX`, `UID`即为他人的全民K歌标识

## 说明
+ 当URL不跟`uid`参数时，默认获取的是笔者的全民K歌歌单
+ 如果你需要自行编译，可修改`Global.vue`中的`UID`为全民K歌中你自己的UID, 这样就可以不用在地址栏中跟上`uid`了
+ 如果你要部署代理后端，可参考[GG-music-Proxy](https://github.com/igordonxiao/GG-music-Proxy), 如果使用了新的代理后端,　需要修改`Global.vue`中的`BASE_DOMAIN`
+ 全民K歌歌曲列表接口默认每一页最多返回`15`条数据
+ 如果获取UID?   
> 例如笔者的全民K歌网页版地址为`http://node.kg.qq.com/personal?uid=639d9d87232a328835`, `UID`则为`639d9d87232a328835`

## Screenshot
![](https://github.com/igordonxiao/GG-music-FE/raw/master/screenshot/screenshot1.png)
![](https://github.com/igordonxiao/GG-music-FE/ralsw/master/screenshot/screenshot2.png)
![](https://github.com/igordonxiao/GG-music-FE/raw/master/screenshot/screenshot3.png)
