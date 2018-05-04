// Description:
//   TODO を管理することができるボットです
// Commands:
//   ボット名 todo     - TODO を作成
//   ボット名 done     - TODO を完了にする
//   ボット名 del      - TODO を消す
//   ボット名 list     - TODO の一覧表示
//   ボット名 donelist - 完了した TODO の一覧表示

'use strict';
const todo = require('todo');
const cron = require('cron').CronJob;

const Todo = require('../todo/save');

module.exports = (robot) => {
  robot.respond(/todo (.+)/i, (msg) => {
    const task = msg.match[1].trim();
    const user = msg.message.user.name;
    todo.todo(task, user);
    //todo.todo(task);
    msg.send('追加しました: ' + task);
  });
  robot.respond(/done (.+)/i, (msg) => {
    const task = msg.match[1].trim();
    const user = msg.message.user.name;
    //todo.done(task);
    todo.done(task, user);
    msg.send('完了にしました: ' + task);
  });
  robot.respond(/del (.+)/i, (msg) => {
    const task = msg.match[1].trim();
    const user = msg.message.user.name;
    //todo.del(task);
    todo.del(task, user);
    msg.send('削除しました: ' + task);
  });
  robot.respond(/list/i, (msg) => {
    //    const list = todo.list();
    /*    if (list.length === 0) {
          msg.send('(TODO はありません)');
        } else {
          msg.send(list.join('\n'));
        }
    */
    const user = msg.message.user.name;
    const todolist = new Array();
    Todo.findAll({
      where:{status: false, user: user}
    }).then(result => {
      result.forEach(r => {
        if (r.status === false) {
          todolist.push(r.todo);
        }
      });
    }).then(() => {
      if(todolist.length === 0) {
        var x = 'No TODO';
      } else{
      var x = todolist.join('\n');
      }
      msg.send(x);
    });

  });
  robot.respond(/donelist/i, (msg) => {
    /*    const donelist = todo.donelist();
        if (donelist.length === 0) {
          msg.send('(完了した TODO はありません)')
        } else {
          msg.send(donelist.join('\n'));
          }
    */
    const donelist = new Array();
    const user = msg.message.user.name;
    Todo.findAll({
      where: {status: true, user: user}
    }).then(result => {
      result.forEach(r => {
        if (r.status === true) {
          donelist.push(r.todo);
        }
      });
    }).then(() => {
      var x = donelist.join('\n');
      msg.send(x);
    });

  })
  /*
  const CronJob = new cron({
    cronTime: '00 00 20 * * *',
    start: true,
    onTick: function () {
      if (todo.list().length === 0) {
        robot.send('(TODO はありません)');
      } else {
        robot.send(todo.list().join('\n'));
      }
    }
  });
*/
  const CronJob = new cron({
    cronTime: '00 00 20 * * *',
    start: true,
    onTick: function () {
      var list = new Array();
      Todo.findAll(
        { status: false }
      ).then(result => {
        result.forEach(r => {
          if (r.status === false) {
            list.push(r.todo);
          }
        });
      }).then(() => {
        if(list.length === 0) {
          var x = 'No TODO';
        } else{
        var x = list.join('\n');
        robot.send({room: 'todo'}, x);
        }
        

      });
    }
  });
}
