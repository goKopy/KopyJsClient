//var axios = require('axios');
'use strict';

// TODO handle the two resources : users & users.items.files
// TODO get all items take parameters like count, cursor & filter.
// TODO handle errors in an efficient way
// TODO add unit test

// The KP class is a js client for the preprod.gokopy.com
(function(global, axios) {

  // The token will be saved after the first authentication
  // The variable will be saved
  var token;

  var MSG_NOT_INT = 'Warning: U didn\'t pass a int :(';

  var KopyService = function(baseUrl) {
      return new KopyService.Init(baseUrl);
  };

  KopyService.Init = function(baseUrl) {

    this.http = axios.create({
      baseURL: baseUrl || 'http://api2-pp.gokopy.com',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if(token) {
      this.http.defaults.headers.Authorization = 'Bearer ' + token;
    }

    // KP.user( ==> userId <== ).items(object).get()
    // The user id for a particular request
    this.userId = null;

    // KP.user(userId).items(==> object <==).get()
    // the value is :
    // - an id for the get() and delete() methods
    // - an object for save() method
    this.object = null;

    this.http.interceptors.response
      .use(function (response) {
        if( response.data.data.user !== undefined ) {
          token = response.data.data.user.token;
        }
        return response.data;
      }, function (error) {
        return Promise.reject(error);
      });
  };

  KopyService.Init.prototype = KopyService.prototype = {};

  //Init methods : items(), devices(), etc.
  ['items', 'devices', 'hashtags', 'friends'].forEach(function(object) {
    KopyService.prototype[object] = function(param) {
        this.objectName = object;
        this.object = param;
        return this;
    };
  });

  // function utilities
  var isInt = function(value) {
    return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value));
  };

  KopyService.prototype.getUrl = function() {
    var url = '/users/' + this.userId + '/' + this.objectName;
    if(isInt(this.object)) {
      url += '/' + this.object;
    }
    return url;
  };

  KopyService.prototype.get = function () {
    if(!isInt(this.object)) {
      console.warn(MSG_NOT_INT);
    }
    return this.http.get(this.getUrl());
  };

  KopyService.prototype.delete = function() {
    if(!isInt(this.object)) {
      console.warn(MSG_NOT_INT);
    }
    return this.http.delete(this.getUrl());
  };

  KopyService.prototype.save = function () {
    var httpVerb = this.object.hasOwnProperty('id') ? this.http.put : this.http.post;
    return httpVerb(this.getUrl(), this.object);
  };

  KopyService.prototype.signup = function (user) {
    return this.http.post('register', user);
  };

  KopyService.prototype.signin = function (user) {
    return this.http.post('authenticate', user);
  };

  KopyService.prototype.user = function (userId) {
    if(!isInt(userId)) {
      console.warn('User id ' + MSG_NOT_INT);
    }
    this.userId = userId;
    return this;
  };

  global.KP = KopyService;

}(window, axios));

// Examples
/*
var f = function(response) {
  console.log(JSON.stringify(response));
};
*/
//KP().signup({username: 'login', password: 'password', email: 'login123@gmail.com'}).then(f).catch(f);
//KP().signin({username: "login", password: "password"}).then(f).catch(f);
//KP().user(1).items({value: 'My first item'}).save().then(f).catch(f); //KO

//KP().user(1).items.save(1, {id: 130782, value: 'reda ATE houmouss', used: true , faved: true});
//KP().items.delete({userId: 1, id: 130774}).then(f).catch(f);

//Error case
//KP().user(1).items({a: 130774}).get().then(f).catch(f);
//KP().user(1).items({item}).save()