var Integration = (function () {
  "use strict";

  var _Integration = {};

  var iframeId = "integration";
  var viewportId = "integration-viewport";

  var PageState = (function () {
    var _restoreObj = {
      bodyProp: {},
      bodyClass: [],
      eventListener: [],
      scroll: {
        x: 0,
        y: 0
      },
      viewport: null
    };

    var _PageState = {};

    _PageState.changeBodyProp = function (key, value) {
      _restoreObj.bodyProp[key] = document.body.value;
      document.body[key] = value;
      return this;
    };

    _PageState.addBodyClass = function (value) {
      var elementClassList = document.body.classList;
      if (elementClassList.contains(value)) {
        return this;
      }
      _restoreObj.bodyClass.push(value);
      elementClassList.add(value);
      return this;
    };

    _PageState.addEventListener = function (el, eventName, callback) {
      if (window.addEventListener){
        el.addEventListener(eventName, callback, false);
      } else {
        attachEvent("on" + eventName, callback)
      }
      _restoreObj.eventListener.push({
        el: el,
        eventName: eventName,
        callback: callback
      });
      return this;
    };

    _PageState.setScroll = function () {
      if (!window.scrollX && !window.scrollY) {
        return this;
      }
      _restoreObj.scroll.x = window.scrollX;
      _restoreObj.scroll.y = window.scrollY;
      return this;
    };

    _PageState.addViewportMetaTag = function () {
      var i;
      var el;
      var headNode;
      var props = {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
        id: viewportId
      };

      if (_restoreObj.viewport) {
        return this;
      }

      el = document.querySelector("meta[name=viewport]");

      if (el) {
        _restoreObj.viewport = el.getAttribute("content");
        el.setAttribute("content", props.content);
        return this;
      }

      el = document.createElement("meta");
      for (i in props) {
        el[i] = props[i];
      }

      headNode = document.head || document.getElementsByTagName('head')[0];
      headNode.appendChild(el);

      return this;
    };

    _PageState.restore = function () {
      var i;
      var listener;
      var bodyClass;
      var scrollX = _restoreObj.scroll.x;
      var scrollY = _restoreObj.scroll.y;
      var viewportTag = document.querySelector("meta[name=viewport]");

      for (i in _restoreObj.bodyProp) {
        document.body[i] = _restoreObj.bodyProp[i];
        delete _restoreObj.bodyProp[i];
      }

      for (i in _restoreObj.bodyClass) {
        bodyClass = _restoreObj.bodyClass.pop();
        document.body.classList.remove(bodyClass);
      }

      for (i in _restoreObj.eventListener) {
        listener = _restoreObj.eventListener.pop();
        if (listener.el.removeEventListener) {
          listener.el.removeEventListener(listener.eventName, listener.callback);
        } else {
          listener.el.detachEvent("on" + listener.eventName, listener.callback); 
        }
      }

      if (viewportTag) {
        viewportTag.setAttribute("content", _restoreObj.viewport || "width=980, user-scalable=yes");
        _restoreObj.viewport = null;
      }

      if (window.scroll && (!scrollX || !scrollY)) {
        window.scroll(scrollX, scrollY);
      }

      return this;
    };

    return _PageState;
  })();

  var Message = (function (argument) {
    var _Message = {};

    function messageCallback (event) {
      /* TODO: check origin url
      if (event.origin !== originUrl) {
          return;
      }
      */
      if (event.data === "integration:close") {
        _Integration.close();
      }
    };

    _Message.listen = function () {
      PageState.addEventListener(window, "message", messageCallback);
      return this;
    };

    return _Message;
  })();

  var Browser = (function () {
    var _Browser = {};

    var _userAgent;
    var _isIOS8;
    var _isSafari;

    _Browser.getUserAgent = function () {
      if (_userAgent === undefined) {
        _userAgent = navigator.userAgent || "";
      }
      return _userAgent;
    };

    _Browser.isIOS8 = function () {
      var userAgent = this.getUserAgent();
      if (_isIOS8 === undefined) {
        _isIOS8 = /(os 8).*(applewebkit)/i.test(userAgent);
      }
      return _isIOS8;
    };

    _Browser.isSafari = function () {
      var userAgent = this.getUserAgent();
      if (_isSafari === undefined) {
        _isSafari = /Version\/[\d\.]+.*Safari/.test(userAgent);
      }
      return _isSafari;
    };

    return _Browser;
  })();

  function createIframe (accessId) {
    var iframe = document.createElement("iframe");
    var props = {
      scrolling: "no",
      id: iframeId,
      src: "/iframe?accessId=" + accessId,
      frameborder: "0",
      allowtransparency: "true"
    };
    var i;
    for (i in props) {
      iframe[i] = props[i];
    }

    document.body.appendChild(iframe);
    Message.listen();
  };

  _Integration.init = function (accessId) {

    PageState.setScroll(); // must be before adding body classes

    PageState.changeBodyProp("overflow", "hidden");
    PageState.addBodyClass("integration-noscroll");
    PageState.addViewportMetaTag();

    if (Browser.isIOS8()) {
      PageState.addBodyClass("integration-ios8");
    }
    if (Browser.isSafari()) {
      PageState.addBodyClass("integration-safari");
    }

    createIframe(accessId);

    return this;
  };

  _Integration.close = function () {
    PageState.restore();
    var iframe = document.getElementById(iframeId);
    var iframeParent = iframe.parentNode;
    if (!iframeParent) {
      return this;
    }
    iframeParent.removeChild(iframe);
    return this;
  }

  _Integration.Browser = Browser;
  return _Integration;
})();

