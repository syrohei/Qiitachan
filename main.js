/*eslint-env es6*/
/*global require*/
/*global console*/
/*global module*/
/*eslint require-yield: "error"*/
/*eslint no-console: ["error", { allow: ["warn", "error","log"] }] */

'use strict'
const Storage = require("./storage")
const Service = require('./service')
const aa = require("aa")
const bot = require("./bot")
const config = require("config")

module.exports = {
  job(keyword){
    aa(function *(){
      console.log("========= job start ============")
      const old_data = yield Storage.get("qiita_items")
      const new_data = yield Service.search_qiita(keyword)
      if (old_data[0].id != new_data[0].id){
        bot.talk.say({ channel: config.channel, text: `${new_data[0].title}\n${new_data[0].url}\n`})
        console.log(old_data[0].title)
        console.log(new_data[0].title)
      }
      const save = yield Storage.save("qiita_items", new_data)
      console.log(save);
      return "========= job done ============"

    }).then((result) => {
      console.log(result)
    }).catch((err) => {
      console.log(err.message);
      if(err.message == "Error: could not load data")
        aa(function *(){
          const data = yield Service.search_qiita(keyword)
          Storage.save("qiita_items", data)
        })
    })
  }
}
