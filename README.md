# Qiitachan

This sample bot a Node.js app with deploying GAE [Google App Engine Managed VMs](https://cloud.google.com/appengine).

## Getting Started

Download and install Google Cloud SDK [Google Cloud SDK](https://cloud.google.com/sdk/docs/).
It has dependencies Python 2.7

in Mac OSX

```
tar -zxvf google-cloud-sdk-113.0.0-darwin-x86_64.tar.gz
./google-cloud-sdk/install.sh
./google-cloud-sdk/bin/gcloud init

```
then check the path of SDK tools and enable command completion `gcloud`
```
gcloud -v
```

To configure Application ,Please check the configuration file of your bot `config/default.json`
```
{
  "token":"your slack token",  
  "channel":"channel id or im id for bot notification. example : D1FBT1UP3",
  "store_path":"./",  
  "keyword":"solidity:blockchain:ethereum:dapps:bitcoin:smartcontract"
}
```

Install node dependencies
```
npm install
```

Local running
```
npm start
```

Deploying GAE
```
npm run deploy
```

## Modules
- botkit https://github.com/howdyai/botkit
- node-cron https://github.com/ncb000gt/node-cron

## License
Qiitachan is licensed under MIT license. Basically you can do whatever you want to with it


## Contribute

if you have a question a issue, please ask me email or github syrohei@gmail.com [@syrohei](https://github.com/syrohei)

bitcoin: 1257U991WqSvhpS65NjMEoWH5UBwQH5N3V

ethereum: 0xbf2b26c21c6a1b248d9c857be756fa3bf261aff1
