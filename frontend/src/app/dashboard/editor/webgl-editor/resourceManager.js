"use strict";

export class ResourceManager {
  constructor() {
    this.resourceQueue = [];
    this.resourceList = [];
  }

  AddResourceToQueue(resourcePath) {
    this.resourceQueue.push(resourcePath);
  }

  GetLoadedResource(resPath) {
    for(var i = 0; i < this.resourceList.length; i++) {
      if(this.resourceList[i].url === resPath) {
        return this.resourceList[i].data;
      }
    }
    return null;
  }

  LoadTextResource(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function () {
      if (request.status < 200 || request.status > 299) {
        callback('Error: HTTP Status Code: ' + request.status + ' : ' + url);
      } else {
        callback(null, request.responseText, url);
      }
    }
    request.send();
  }

  StartResourceFetch(resourceMgr, finishCallback) {
    if(resourceMgr.resourceQueue.length > 1) {
      var resource = resourceMgr.resourceQueue.pop();
      resourceMgr.LoadTextResource(resource, function(err, text, url) {
        if(err) {
          alert(err);
        } else {
          var resObj = {};
          resObj.url = url;
          resObj.data = text;
          resourceMgr.resourceList.push(resObj);
          resourceMgr.StartResourceFetch(resourceMgr, finishCallback);
        }
      });
    }
    else if(resourceMgr.resourceQueue.length === 1) {
      var resource = resourceMgr.resourceQueue.pop();
      resourceMgr.LoadTextResource(resource, function(err, text, url) {
        if(err) {
          alert(err);
        } else {
          var resObj = {};
          resObj.url = url;
          resObj.data = text;
          resourceMgr.resourceList.push(resObj);
          finishCallback();
        }
      });
    }

  }
}
