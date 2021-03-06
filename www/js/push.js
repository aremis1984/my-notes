angular.module("push.utils", ['ionic', 'ngCordova'])
  .factory("PushNotifications", function($cordovaPush, $rootScope){

    var msgCallback;
    var regCallback;
    var errorCallback;
    var gcmSenderId;

    var service = {
      setGcmSenderId: setGcmSenderId,
      ensureRegistration: ensureRegistration,
      getToken: getToken,
      onMessage: onMessage
    }

    return service;

    function setToken(token) {
      window.localStorage.setItem('pushToken', token);
    }

    function setGcmSenderId(senderId) {
      gcmSenderId = senderId;
    }

    function getToken() {
      return window.localStorage.getItem('pushToken', '');
    }

    function onMessage(cb) {
      msgCallback = cb;
    }

    // returns an object to the callback with source and token properties
    function ensureRegistration(cb, errorCb) {
      regCallback = cb;
      errorCallback = errorCb;

      document.addEventListener("deviceready", function(){
        if (ionic.Platform.isAndroid()) {
          registerAndroid();
          $rootScope.$on('$cordovaPush:notificationReceived', androidPushReceived);
        }
        if (ionic.Platform.isIOS()) {
          registerIOS();
          $rootScope.$on('$cordovaPush:notificationReceived', iosPushReceived);
        }
      });

      return this;
    }

    function registerIOS() {
      var config = {
        "badge": true,
        "sound": true,
        "alert": true,
      };

      $cordovaPush.register(config).then(function(result) {
        setToken(result.deviceToken);
        if (regCallback !== undefined) {
          regCallback({
            source: 'ios',
            token: result.deviceToken
          });
        }
      }, function(err) {
        if (errorCallback !== undefined) {
          errorCallback(err);
        }
        console.log("Registration error on IOS: ", err)
      });

    }

    // Inits the Android registration
    // NOTICE: This will not set the token inmediatly, it will come
    // on the androidPushReceived
    function registerAndroid() {
      var config = {
        "senderID": gcmSenderId
      };

      // PushPlugin's telerik only register if necesary or when upgrading app
      $cordovaPush.register(config).then(function(result) {
        console.log("Registration requested!");
      }, function(err) {
        console.log("Error registering on Android", err);
      });


    }

    // Process incoming push messages from android
    function androidPushReceived(event, notification) {
      switch(notification.event) {
        case 'registered':
          if (notification.regid.length > 0 ) {
            setToken(notification.regid);
            if (regCallback !== undefined) {
              regCallback({
                source: 'android',
                token: notification.regid
              })
            }
          }
          break;

        case 'message':
          if (msgCallback !== undefined) { msgCallback(notification) }
          break;

        case 'error':
          console.log('GCM error = ' + notification.msg);
          break;

        default:
          console.log('An unknown GCM event has occurred');
          break;
      };
    }

    function iosPushReceived(event, notification) {
      if (msgCallback !== undefined) { msgCallback(notification) }
    }

  });