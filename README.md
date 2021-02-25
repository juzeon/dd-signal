![dd-signal](https://socialify.git.ci/juzeon/dd-signal/image?description=1&font=Inter&forks=1&issues=1&logo=https%3A%2F%2Fimg14.360buyimg.com%2Fddimg%2Fjfs%2Ft1%2F168143%2F5%2F7773%2F27490%2F603723edE7b9ecb4d%2Fd125f3119c9024f4.jpg&pattern=Plus&stargazers=1&theme=Light)

# dd-signal

[LOGO图来源](https://www.zedge.net/wallpaper/b944d4d5-c2e8-42ca-9903-7dc2d4aa7ad6)

监控多个B站主播的直播状态，并发送开播、下播提醒消息的Telegram Bot。

>  这个机器人可以帮助早已把Telegram作为日常摸鱼工具的你dd一堆vtubers，解决B站客户端自带开播提醒基本没法用的问题。

我搭建的公开机器人：[@dd_signal_bot](https://t.me/dd_signal_bot)

## 特性

- 同时监控多个B站主播的直播状态。
- 通过Telegram Bot原生方式添加、删除监控列表的主播。
- 适配[vdb](https://github.com/dd-center/vdb/)虚拟主播列表，支持直接搜索。

## 部署

以在Linux上安装为例。

1.通过[@BotFather](https://t.me/BotFather)申请机器人，并记录`Telegram Bot API Token`。

2.安装Node.js和npm。[教程](https://nodejs.org/en/download/package-manager/)。

3.拉取本项目，并安装依赖。

```bash
git clone https://github.com/juzeon/dd-signal.git
cd dd-signal/
npm install
```

4.运行程序。

```bash
node ./index.js --token "您的Telegram Bot API Token"
```

您可以设定更多参数：

```bash
--interval <IntervalBySec> - 可选，每次访问B站API间隔的秒数，默认为5
--token <TelegramBotToken> - 必选，Telegram Bot Token
--proxy <HTTPProxy> - 可选，以 http:// 开头的代理
```

## 演示

帮助：

![](https://i.imgur.com/QKtSPe1.jpg)

添加：

![](https://i.imgur.com/Jtn0Gbt.png)

搜索：

![](https://i.imgur.com/qlgOUw2.jpg)

删除：

![](https://i.imgur.com/9OjNMHF.png)

列表：

![](https://i.imgur.com/Fjsd6ic.png)

开播、下播提醒：

![](https://i.imgur.com/1gYA7MX.jpg)