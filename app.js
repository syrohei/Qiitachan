/*global require*/
/*global process*/
/*global console*/
/*eslint-env es6*/
/*eslint prefer-const: "error"*/
/*eslint no-console: ["error", { allow: ["warn", "error","log"] }] */

'use strict';

const express = require('express');
const config = require('config');
const Botkit = require('botkit')
const rp = require('request-promise');
const CronJob = require('cron').CronJob;
const Store = require("jfs");


const token = config.token
const channel = config.channel
const keyword = config.keyword
const store_path = config.store_path
const Storage = new Store(store_path)

const app = express();

const controller = Botkit.slackbot({
  json_file_store: store_path,
  debug:true
})
const bot = controller.spawn({
  token: token
}).startRTM()

const reply_with_attachments = {
  'username': 'Qiitachan',
  'text': 'This is a pre-text',
  'attachments': [
    {
      'fallback': 'Please check notification logic .',
      'title': 'You can create a Bot?',
      'text': 'Please check notification logic .',
      'color': '#7CD197'
    }
  ],
  //'icon_url': 'http://lorempixel.com/48/48',
  'icon_emoji': ':sushi'
}
//conversation
controller.hears(['hello','hi'], 'direct_message,direct_mention,mention', (bot, message) => {
  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'robot_face'
  },(err, res) => {
    if (err){
      bot.botkit.log('Failed to add emoji', err)
    }else {
      bot.botkit.log(res)
    }
  })

  controller.storage.users.get(message.user, (err, user) => {
    if (user && user.name){
      bot.reply(message, 'Hello' + user.name + '!!')
    }else{
      bot.reply(message, reply_with_attachments)
    }
  })
})

controller.hears(['all','ぽん'], 'direct_message,direct_mention,mention', (bot, message) => {
  Storage.get("qiita_items", (err, old_data) => {
    if (old_data && old_data.items){
      const _old = old_data.items
      _old.forEach((item) => {
        bot.say({
          channel: message.channel,
          text: item.title + "\n" + item.url
        })
      })
    }
  })
})

//cron job
const cron = new CronJob({
  cronTime: '00 * * * * *',
  onTick: () => {
    const url = `http://qiita.com/api/v2/items?page=1&per_page=20&query=${keyword}`
    rp(url)
      .then((new_data) => {
        Storage.get("qiita_items", (err, old_data) => {
          const _new = JSON.parse(new_data)
          if (old_data && old_data.items){
            const _old = old_data.items
            Storage.save("qiita_items", {
              items: _new
            }, (err) => {
              if (!err){
                console.log(_new[0].title)
                console.log(_old[0].title)

                if (_new[0].id != _old[0].id){
                  const say = () => {
                    bot.say({
                      channel: channel,
                      text: _new[0].title + "\n" + _new[0].url
                    }, (err) => {
                      if (err) {
                        bot.botkit.log(err);
                        say()
                      }
                    })
                  }
                  say()
                }
              }
            })
          }else{
            Storage.save( "qiita_items", {
              items: _new
            }, (err) => {
              if (err){
                console.log(err);
              }
            })
          }
        })
      })
        // Process html...
      .catch(function (err) {
          console.log(err);
        // Crawling failed...
      })
  },
  start: false,
  timeZone: 'Asia/Tokyo'
});
cron.start();


//request events
app.get('/', (req, res) => {
  bot.say({ channel: channel, text: "requestが来たよ! \n ```" + JSON.stringify(req.route) + " \n```"})
  res.status(200).send('hello bots!');
});



// Start the server
var server = app.listen(process.env.PORT || '8080', function () {
  console.log('listen port %s', server.address().port);
});
