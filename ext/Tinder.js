/**
 * Tinder
 */

Flamite.Tinder = (function(Flamite) {
  var token = false;
  var user = false;

  function request(path, method, data, options) {

    if (options) {
      tabId = options.tabId || null; 
    }

    if (!token) {
      Flamite.Facebook.openAuthTab(tabId);
    }

    return $.ajax({
      url: 'https://api.gotinder.com/' + path,
      type: method,
      data: data,
      beforeSend: function(request) {

        if (path == 'auth') {
          return;
        }

        request.setRequestHeader('X-Auth-Token', token);
        request.setRequestHeader('os-version', 21);
        request.setRequestHeader('app-version', 767);
        request.setRequestHeader('platform', 'android');
      }
    }).fail(function(error) {

      // or error.status == 401
      if (error.status != 200) {
        Flamite.Facebook.openAuthTab(tabId);
      }
    });
  }

  function setToken(_token) {
    localStorage.setItem('token', _token);
    token = _token;
  }

  function getToken() {
    return token;
  }

  function setUser(_user) {
    user = _user;
  }

  function getUser() {
    return user;
  }

  function reset() {
    user = null;
    token = null;
    localStorage.removeItem('token');
  }

  function chromeEvent() {

    // edit user-agent for api
    chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
      for (var i = 0; i < details.requestHeaders.length; ++i) {
        if (details.requestHeaders[i].name === 'User-Agent') {
          details.requestHeaders[i].value = 'Tinder Android Version 4.0.3';
        }
      }
      return {requestHeaders: details.requestHeaders};
    }, {urls: ["*://api.gotinder.com/*"]}, ["blocking", "requestHeaders"]);

    chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {

      // Tinder request
      if (request.type === 'request') {
        var prm = Flamite.Tinder.request(
          request.path, 
          request.method ? request.method : 'GET', 
          request.data ? request.data : {},
          {tabId: sender.tab.id}
        );

        prm.done(function(obj) {
          sendResponse(obj);
        });

        prm.fail(function(obj) {
          sendResponse(false);
        });

        return true;
      }

      else if (request.type === 'reset') {
        reset();
        sendResponse(true);
        return;
      }

      // post message
      else if (request.type === 'message_post') {
        Flamite.Tinder.request('user/matches/' + request.id, 'POST', {
          message: request.message
        });

        return false;
      } 

      // get tinder user
      else if (request.type == 'getUser') {
        var user = getUser();

        if (user) {
          sendResponse(user);
        } else {
          sendResponse(null);
          //Flamite.Facebook.openAuthTab(sender.tab.id);
        }

        return;
      }
    });
  }

  return {
    request: request,
    setToken: setToken,
    getToken: getToken,
    setUser: setUser,
    getUser: getUser,

    init: function() {
      token = localStorage.getItem('token');

      chromeEvent();
    }
  };
})(Flamite);