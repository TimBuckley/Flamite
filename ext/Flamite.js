/**
 * Flamite
 */

var Flamite = (function() {
  var user = null;
  var appUrl = 'http://flamite.local';

  function openAppTab(tabId) {
    if (tabId) {
      chrome.tabs.update(tabId, {
        url: appUrl
      });
    } else {
      chrome.tabs.create({
        url : appUrl
      });
    }
  }

  function chromeEvent() {

    // listen Flamite button
    chrome.browserAction.onClicked.addListener(function(tab) {
      openAppTab();
    });
  }

  return {
    openAppTab: openAppTab,

    init: function() {
      // init
      Flamite.Tinder.init();
      Flamite.Facebook.init();

      // listen Chrome event
      chromeEvent();
    }
  };
})();