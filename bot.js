/*eslint-env es6*/
/*global require*/
/*global module*/

'use strict'

const config = require('config')
const Botkit = require('botkit')
const Storage = require("./storage")
const Service = require("./service")
const controller = Botkit.slackbot({
  json_file_store: config.store_path,
  debug:true
})
const bot = controller.spawn({
  channel: config.channel,
  token: config.token
})

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

controller.hears('s (.*)','direct_message,direct_mention,mention',(bot,message) => {
  const text = message.match[1]
  Service.search_qiita(text).then((data) => {
    return bot.reply(message,`${String(data[0].title)}\n\n${data[0].url}\n\n`);
  })
})

controller.hears(['all','ぽん'], 'direct_message,direct_mention,mention', (bot, message) => {
  Storage.get("qiita_items")
    .then((items) => {
      items.forEach((item) => {
        bot.say({
          channel: message.channel,
          text: item.title + "\n" + item.url
        })
      })
    })
})


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


module.exports = {
  talk: bot,
  start(){ bot.startRTM() }
}
