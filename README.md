# Qiitachan

This sample bot a Node.js app with deploying GAE [Google App Engine Managed VMs](https://cloud.google.com/appengine).

## Getting Started

download and install Google Apps SDK [Google Apps SDK](https://cloud.google.com/sdk/docs/)
SDK is dependencies Python 2.7

in Mac OSX

```
tar -zxvf google-cloud-sdk-113.0.0-darwin-x86_64.tar.gz
./google-cloud-sdk/install.sh
./google-cloud-sdk/bin/gcloud init

```
### config/default.json
Please check your application configuration
```
{
  "token":"your slack token",  
  "channel":"channel id or im id. example : D1FBT1UP3",
  "store_path":"./",
  "keyword":"solidity:blockchain:ethereum:dapps:bitcoin:smartcontract"
}
```
