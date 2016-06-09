// Copyright 2015-2016, Google, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// [START app]
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
      bot.botkit.log('Failed to add emoji reaction:(', err)
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
      'fallback': 'To be useful, I need you to invite me in a channel.',
      'title': 'How can I help you?',
      'text': 'To be useful, I need you to invite me in a channel ',
      'color': '#7CD197'
    }
  ],
  'icon_url': 'http://lorempixel.com/48/48'
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
  res.status(200).send('Hello, world!');
});



// Start the server
var server = app.listen(process.env.PORT || '8080', function () {
  console.log('App listening on port %s', server.address().port);
  console.log('Press Ctrl+C to quit.');
});
// [END app]
