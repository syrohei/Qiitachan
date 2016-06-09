'use strict';

var express = require('express');
var Botkit = require('botkit')
var CronJob = require('cron').CronJob;
var controller = Botkit.slackbot({
  debug:true,
})
var app = express();

var bot = controller.spawn({
  token: process.env.token
}).startRTM()


//conversation
controller.hears(['hello','hi'], 'direct_message,direct_mention,mention', function(bot, message){
  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'robot_face',
  },function(err, res){
    if (err){
      bot.botkit.log('Failed to add emoji', err)
    }
  })

  controller.storage.users.get(message.user, function(err, user) {
    if (user && user.name){
      bot.reply(message, 'Hello' + user.name + '!!')
    }else{
      bot.reply(message, reply_with_attachments)
    }
  })
})


var reply_with_attachments = {
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

var channel = "D1FBT1UP2"
//cron job 
var cron = new CronJob({
  cronTime: '00 * * * * *', 
  onTick: function() {
    bot.say({
      channel: channel,
      text: 'よろしくお願いします！'
    }, function(err) {
      if (err) {
        bot.botkit.log(err);
      }
    });
  },
  start: false,
  timeZone: 'Asia/Tokyo'
});
cron.start();


//request events
app.get('/', function (req, res) {
  bot.say({ channel: channel, text: "requestが来たよ! \n ```" + JSON.stringify(req.route) + " \n```"})
  res.status(200).send('hello bots!');
});



// Start the server
var server = app.listen(process.env.PORT || '8080', function () {
  console.log('listen port %s', server.address().port);
});
