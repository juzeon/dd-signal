const axios=require('axios');
const TelegramBot = require('node-telegram-bot-api');
const EventEmitter = require('events');
const includes={
    isInt(value) {
        return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
    },
    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    },
    parseTgUserNickname(user){
        return ((user.first_name?user.first_name:'')
            +' '
            +(user.last_name?user.last_name:'')).toString().trim();
    },
    defTgMsgForm:{
        parse_mode:'Markdown',
        disable_web_page_preview:true
    },
    axios:axios.create({
        timeout:15000
    }),
    bot:new TelegramBot(),
    template:{
        networkError:'网络错误，请重试。'
    },
    formatWatchMessagePartial(arr){
        let str='';
        for(let vtb of arr){
            str+=vtb.liveStatus?'🟢  ':'🔴  ';
            str+='`'+vtb.username+'`';
            str+='  `'+vtb.mid+'`\n';
            str+=vtb.liveStatus?'👉▶️  ['+vtb.title+'](https://live.bilibili.com/'+vtb.roomid+')\n':'';
        }
        return str;
    },
    emitter:new EventEmitter()
};
module.exports=includes;