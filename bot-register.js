const $ = require('./includes');
const stripIndent = require('strip-indent');
const dbm = require('./dbm');
module.exports = () => {
    $.bot.onText(/\/start/, (msg) => {
        $.bot.sendMessage(msg.chat.id, '嗨，'
            + $.parseTgUserNickname(msg.from)
            + '\n您可以输入 /help 查看命令帮助。', $.defTgMsgForm);
    });
    $.bot.onText(/\/help/, msg => {
        $.bot.sendMessage(msg.chat.id, stripIndent(`
    命令列表：
    
    /start - 启用机器人。
    /add \`<B站用户地址或ID、直播间地址>\` - 添加新主播至监控列表。
      eg. /add https://space.bilibili.com/375504219
          /add 375504219
          /add https://live.bilibili.com/14917277
    /del \`<ID>\` - 将ID对应的主播移出监控列表。
    /list - 查看您的监控列表。
    /help - 显示帮助。
    `), $.defTgMsgForm);
    });
    $.bot.on('text',msg=>{
        if(msg.text.toString().startsWith('❌  ')){
            let username=msg.text.toString().slice(3).trim();
            let vtb=dbm.getVtbByUsername(username);
            if(!vtb){
                $.bot.sendMessage(msg.chat.id,'不存在主播 `'+username+'`',$.defTgMsgForm);
                return;
            }
            dbm.delWatch(msg.chat.id,vtb.mid);
            $.bot.sendMessage(msg.chat.id,'已删除主播 `'+vtb.username+'`。',$.defTgMsgForm);
        }
    });
    $.bot.onText(/^\/del$/,msg=>{
        let watches=dbm.getWatchByChatid(msg.chat.id);
        if(!watches.length){
            $.bot.sendMessage(msg.chat.id,'您的监控列表为空。',$.defTgMsgForm);
            return;
        }
        let keyboard=[];
        let step=0;
        for(let watch of watches){
            if(step==0){
                keyboard.push(['❌  '+watch.username]);
                step=1;
            }else{
                keyboard[keyboard.length-1].push('❌  '+watch.username);
                step=0;
            }
        }
        $.bot.sendMessage(msg.chat.id,'请在弹出的键盘中选择需要删除的主播。',{
            reply_markup:{
                keyboard:keyboard
            }
        });
    });
    $.bot.onText(/\/del (.+)/,(msg,match)=>{
        let mid=match[1].toString().trim();
        if(!$.isInt(mid)){
            $.bot.sendMessage(msg.chat.id,'请输入正确的ID。',$.defTgMsgForm);
            return;
        }
        if(!dbm.existsWatch(msg.chat.id,mid)){
            $.bot.sendMessage(msg.chat.id,'该主播不在您的监控列表中。',$.defTgMsgForm);
            return;
        }
        let vtb=dbm.getVtbByMid(mid);
        dbm.delWatch(msg.chat.id,mid);
        $.bot.sendMessage(msg.chat.id,'已删除主播 `'+vtb.username+'`。',$.defTgMsgForm);
    });
    $.bot.onText(/\/list/,msg=>{
        let watchArr=dbm.getWatchByChatid(msg.chat.id);
        let message='您的监控列表：\n\n';
        message+=$.formatWatchMessagePartial(watchArr);
        $.bot.sendMessage(msg.chat.id,message,$.defTgMsgForm);
    });
    $.bot.onText(/\/add (.+)/, async (msg,match) => {
        let param=match[1].toString().trim();
        let mid;
        if($.isInt(param)){
            mid=param;
        }else{
            let spaceMatch=param.match(/https?:\/\/space.bilibili.com\/(\d+)/);
            let liveMatch=param.match(/https?:\/\/live.bilibili.com\/(\d+)/);
            if(spaceMatch){
                mid=spaceMatch[1];
            }else if(liveMatch){
                roomid=liveMatch[1];
                let resp;
                try {
                    resp = await $.axios.get('https://api.live.bilibili.com/room/v1/Room/room_init?id=' + roomid);
                }catch(err){
                    $.bot.sendMessage(msg.chat.id,$.template.networkError,$.defTgMsgForm);
                    return;
                }
                if(resp.data.code){
                    $.bot.sendMessage(msg.chat.id,resp.data.message,$.defTgMsgForm);
                    return;
                }
                mid=resp.data.data.uid;
            }else{
                $.bot.sendMessage(msg.chat.id,'请输入正确的网址或ID。',$.defTgMsgForm);
                return;
            }
        }
        if(dbm.existsWatch(msg.chat.id,mid)){
            $.bot.sendMessage(msg.chat.id,'该主播已在您的监控列表中。');
            return;
        }
        $.axios.get('https://api.bilibili.com/x/space/acc/info?mid='+mid).then(resp=>{
            if(resp.data.code){
                $.bot.sendMessage(msg.chat.id,resp.data.msg,$.defTgMsgForm);
                return;
            }
            dbm.addVtbToWatch(msg.chat.id,mid,
                resp.data.data.live_room.roomid,
                resp.data.data.name,
                resp.data.data.live_room.liveStatus,
                resp.data.data.live_room.title);
            $.bot.sendMessage(msg.chat.id,'已添加主播 `'+resp.data.data.name+'`。',$.defTgMsgForm);
        }).catch(err=>{
            $.bot.sendMessage(msg.chat.id,$.template.networkError,$.defTgMsgForm);
        });
    });
};