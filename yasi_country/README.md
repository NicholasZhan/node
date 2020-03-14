# 《使用 superagent 与 cheerio 完成简单爬虫》

## 目标

当在浏览器中访问 `http://localhost:3000/` 时，输出 国家区域和是否机试，以 json 的形式。


## 挑战

访问 `http://localhost:3000/` 时，

示例：

## 知识点

1. 学习使用 superagent 抓取网页
2. 学习使用 cheerio 分析网页

## 课程内容

Node.js 总是吹牛逼说自己异步特性多么多么厉害，但是对于初学者来说，要找一个能好好利用异步的场景不容易。我想来想去，爬虫的场景就比较适合，没事就异步并发地爬几个网站玩玩。

本来想教大家怎么爬 github 的 api 的，但是 github 有 rate limit 的限制，所以只好牺牲一下 CNode 社区（国内最专业的 Node.js 开源技术社区），教大家怎么去爬它了。

我们这回需要用到三个依赖，分别是 express，superagent 和 cheerio。

先介绍一下，

superagent(http://visionmedia.github.io/superagent/ ) 是个 http 方面的库，可以发起 get 或 post 请求。

cheerio(https://github.com/cheeriojs/cheerio ) 大家可以理解成一个 Node.js 版的 jquery，用来从网页中以 css selector 取数据，使用方式跟 jquery 一样一样的。


我们应用的核心逻辑长这样

OK，一个简单的爬虫就是这么简单。这里我们还没有利用到 Node.js 的异步并发特性。不过下两章内容都是关于异步控制的。

记得好好看看 superagent 的 API，它把链式调用的风格玩到了极致。
