/*eslint-env es6*/
/*global require*/
/*global module*/
/*eslint require-yield: "error"*/
/*eslint no-console: ["error", { allow: ["warn", "error","log"] }] */

'use strict'

const isJSON = require('is-json');
const rp = require('request-promise')

module.exports = {
  search_qiita(text){
    return new Promise((resolve, reject) => {
      const url = `https://qiita.com/api/v2/items?page=1&per_page=20&query=${text}`
      rp(url)
        .then((data) => {
          if (isJSON(data)){
            resolve(JSON.parse(data))
          }else {
            reject(new Error("not json"))
          }
        })
        .catch((err) => {
          reject(new Error(err))
        })
    })
  }
}
