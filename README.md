# dd-signal

监控多个B站主播的直播状态，并发送开播、下播提醒消息的Telegram Bot。

>  这个机器人可以帮助早已把Telegram作为日常摸鱼工具的你dd一堆vtubers，解决B站客户端自带开播提醒基本没法用的问题。

我搭建的公开机器人：[@dd_signal_bot](https://t.me/@dd_signal_bot)

## 特性

- 同时监控多个B站主播的直播状态
- 通过Telegram Bot原生方式添加、删除监控列表的。

## 演示



## 部署

以在Linux上安装为例。

1.安装Node.js和npm。[教程](https://nodejs.org/en/download/package-manager/)。

2.拉取本项目，并安装依赖。

```bash
git clone https://github.com/juzeon/dd-signal.git
cd dd-signal/
npm install
```

3.运行程序。

```bash
node ./index.js --token "您的Telegram Bot API Token"
```

您可以设定更多参数：

```bash
--interval <IntervalBySec> - 可选，每次访问B站API间隔的秒数，默认为5
--token <TelegramBotToken> - 必选，Telegram Bot Token
--proxy <HTTPProxy> - 可选，以 http:// 开头的代理
```

