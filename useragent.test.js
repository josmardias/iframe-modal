(function () {

  //ugly copy and paste testing of browser detection

  var mockNavigator = {userAgent: ""};
  var Browser;

  (function (navigator) {
    Browser = (function () {
      var _Browser = {};

      var _userAgent;
      var _isIOS8;
      var _isSafari;

      _Browser.getUserAgent = function () {
        //if (_userAgent === undefined) {
          _userAgent = navigator.userAgent || "";
        //}
        return _userAgent;
      };

      _Browser.isIOS8 = function () {
        var userAgent = this.getUserAgent();
        //if (_isIOS8 === undefined) {
          _isIOS8 = /(os 8).*(applewebkit)/i.test(userAgent);
        //}
        return _isIOS8;
      };

      _Browser.isSafari = function () {
        var userAgent = this.getUserAgent();
        //if (_isSafari === undefined) {
          _isSafari = /Version\/[\d\.]+.*Safari/.test(userAgent);
        //}
        return _isSafari;
      };

      return _Browser;
    })();
  })(mockNavigator);

  var userAgentList = {
    "Chrome Linux": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36",
    "Chrome android 4.4.4": "Mozilla/5.0 (Linux; Android 4.4.4; XT1040 Build/KXB21.14-L1.56) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36",
    "Chrome iphone ios8": "Mozilla/5.0 (iPhone; CPU iPhone OS 8_1_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) CriOS/41.0.2272.58 Mobile/12B466 Safari/600.1.4 (000418)",
    "Chrome ipad ios8": "User agent: Mozilla/5.0 (iPad; CPU OS 8_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) CriOS/41.0.2272.58 Mobile/12D508 Safari/600.1.4 (000567)",
    "Safari iphone ios8": "Mozilla/5.0 (iPhone; CPU iPhone OS 8_1_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12B466 Safari/600.1.4",
    "Safari ipad ios8": "User agent: Mozilla/5.0 (iPad; CPU OS 8_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12D508 Safari/600.1.4",
    "Safari mac osx": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8) AppleWebKit/536.25 (KHTML, like Gecko) Version/6.0 Safari/536.25",
    "Firefox 12 mac osx": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:12.0) Gecko/20100101 Firefox/12.0"
  }

  for (i in userAgentList) {
    mockNavigator.userAgent = userAgentList[i];
    console.log(i);
    console.log("\tios8: " + Browser.isIOS8() + ", safari: " + Browser.isSafari());
  }

})();
