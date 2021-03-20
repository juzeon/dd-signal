process.env["NTBA_FIX_319"] = 1;
const args = require('minimist')(process.argv.slice(2));
const urlParse = require('url-parse');
const fs=require('fs');
const path=require('path');
const $ = require('./includes');
const botRegister = require('./bot-register');
const dbm = require('./dbm');


const helpText = `
参数：
  --interval <IntervalBySec> - 可选，每次访问B站API间隔的秒数，默认为5
  --token <TelegramBotToken> - 必选，Telegram Bot Token
  --proxy <HTTPProxy> - 可选，以 http:// 开头的代理
`;
const interval = args.interval ? args.interval : 5;
if (!$.isInt(interval)) {
    console.log(helpText);
    process.exit(-1);
}
const token = args.token;
if (!token) {
    console.log(helpText);
    process.exit(-1);
}
$.bot.token = token;
const proxy = args.proxy;
if (proxy) {
    proxyUrlObj = urlParse(proxy, true);
    if (proxyUrlObj.protocol != 'http:') {
        console.log('--proxy 只支持HTTP PROXY');
        process.exit(-1);
    }
    $.bot.options.request = {
        proxy: proxy
    };
    $.axios.defaults.proxy = {
        host: proxyUrlObj.hostname,
        port: proxyUrlObj.port
    };
}
botRegister();
$.bot.startPolling();
let vtbs = dbm.getVtbs();
$.emitter.on('updateVtbs', () => {
    vtbs=dbm.getVtbs();
    console.log('Reloaded Vtbs.');
});
console.log('dd-signal 已启动！');
async function notifySubscriberChats(vtb){
    console.log('Let\'s notify subscribers about '+vtb.username);
    let head='`'+vtb.username+'` '+(vtb.liveStatus?'开播啦！':'下播了。')+'\n\n';
    let watches=dbm.getWatchByMid(vtb.mid);
    for(let [index,watch] of watches.entries()){
        console.log(watch.chatid);
        let body=$.formatWatchMessagePartial(dbm.getWatchByChatid(watch.chatid));
        await $.bot.sendMessage(watch.chatid,head+body,$.defTgMsgForm);
        if(index%20==0 && index!=0){
            await $.sleep(1000);
        }
    }
}
(async function rotate() {
    for(let vtb of vtbs){
        console.log('Checking '+vtb.username);
        let resp;
        try {
            resp=await $.axios.get('https://api.bilibili.com/x/space/acc/info?mid=' + vtb.mid);
        }catch(err){
            console.error('Network Error: '+err);
            await $.sleep(interval * 1000);
            continue;
        }
        if(resp.data.code){
            console.error('Error: '+resp.data.message);
            await $.sleep(interval * 1000);
            continue;
        }
        if(!resp.data.data.live_room){// temporary fix
            console.log('Error: '+resp.data.data);
            await $.sleep(interval * 1000);
            continue;
        }
        console.log(vtb.username+': liveStatus='+resp.data.data.live_room.liveStatus);
        if(resp.data.data.name!=vtb.username){
            dbm.updateVtbColumn('username',resp.data.data.name,vtb.mid);
            vtb.username=resp.data.data.name;
        }
        if(resp.data.data.live_room.title!=vtb.title){
            dbm.updateVtbColumn('title',resp.data.data.live_room.title,vtb.mid);
            vtb.title=resp.data.data.live_room.title;
        }
        if(resp.data.data.live_room.liveStatus!=vtb.liveStatus){
            dbm.updateVtbColumn('liveStatus',resp.data.data.live_room.liveStatus,vtb.mid);
            vtb.liveStatus=resp.data.data.live_room.liveStatus;
            notifySubscriberChats(vtb);
        }
        await $.sleep(interval * 1000);
    }
    if(!vtbs.length){
        await $.sleep(interval * 1000);
    }
    setImmediate(rotate);
})();
(async function loadVtbList(){
    let json=JSON.parse(fs.readFileSync(path.join(__dirname,'vtbs.json')));
    for(let vtb of json.vtbs){
        if(vtb.type!='vtuber'){
            continue;
        }
        let username=vtb.name[vtb.name.default];
        let mid;
        for(let account of vtb.accounts){
            if(account.platform=='bilibili'){
                mid=account.id;
                break;
            }
        }
        if(!mid){
            continue;
        }
        $.vtbList.push({
            mid:mid,
            username:username
        });
    }
    console.log('Loaded '+json.vtbs.length+' vtubers');
})();