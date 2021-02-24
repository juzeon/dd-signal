const $=require('./includes');
const path=require('path');
const fs=require('fs');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname,'dd-signal.db'), { verbose: console.log });
let tables=['vtbs','watch'];
for(let table of tables){
    let result=db.prepare('SELECT count(*) as exist FROM sqlite_master WHERE type=\'table\' AND name = ?').get(table);
    if(!result.exist){
        db.exec(fs.readFileSync(path.join(__dirname,'sql/'+table+'.sql'),'utf8'));
    }
}

module.exports={
    addVtbToWatch(chatid,mid,roomid,username,liveStatus,title){
        const vtb=this.getVtbByMid(mid);
        if(!vtb) {
            db.prepare('insert into vtbs (mid,roomid,username,liveStatus,title) values' +
                '(?,?,?,?,?)').run(mid, roomid, username, liveStatus, title);
            $.emitter.emit('updateVtbs');
        }
        db.prepare('insert into watch (chatid,mid) values(?,?)').run(chatid,mid);
    },
    getVtbByMid(mid){
        return db.prepare('select * from vtbs where mid=?').get(mid);
    },
    getWatchByChatid(chatid){
        return db.prepare('select w.*,v.* from watch w inner join vtbs v on w.mid=v.mid where w.chatid=?').all(chatid);
    },
    existsWatch(chatid,mid){
        return db.prepare('select rowid from watch where chatid=? and mid=?').get(chatid,mid)?true:false;
    },
    delWatch(chatid,mid){
        db.prepare('delete from watch where chatid=? and mid=?').run(chatid,mid);
        let other=db.prepare('select * from watch where mid=?').get(mid);
        if(!other){
            db.prepare('delete from vtbs where mid=?').run(mid);
            $.emitter.emit('updateVtbs');
        }
    },
    getVtbByUsername(username){
        return db.prepare('select * from vtbs where username=?').get(username);
    },
    getVtbs(){
        return db.prepare('select * from vtbs').all();
    },
    updateVtbColumn(column,value,mid){
        db.prepare('update vtbs set '+column+'=? where mid=?').run(value,mid);
    },
    getWatchByMid(mid){
        return db.prepare('select * from watch where mid=?').all(mid);
    }
};