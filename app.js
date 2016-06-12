/*global require*/
/*global process*/
/*global console*/
/*eslint-env es6*/
/*eslint prefer-const: "error"*/
/*eslint no-console: ["error", { allow: ["warn", "error","log"] }] */

'use strict';

const config = require('config');
const main = require("./main")
const bot = require("./bot")
//conversation
bot.start()
//cron job
const CronJob = require('cron').CronJob;
const cron = new CronJob({
  cronTime: '00 * * * * *',
  onTick: () => {
    main.job(config.channel, config.keyword)
  },
  start: false,
  timeZone: 'Asia/Tokyo'
})
cron.start()
//request events
const express = require('express')
const app = express();
app.get('/', (req, res) => {
  bot.talk.say({ text: "requestが来たよ! \n ```" + JSON.stringify(req.route) + " \n```"})
  res.status(200).send('hello bots!');
});
// Start the server
var server = app.listen(process.env.PORT || '8080', () => {
  console.log('listen port %s', server.address().port);
});
