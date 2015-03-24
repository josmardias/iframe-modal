var Integration = (function () {
  var _Integration = {};

  var iframeId = "integration";
  var userAgent = navigator.userAgent || "";
  var isIOS8 = /(os 8).*(applewebkit)/i.test(userAgent);
  var isSafari = /Version\/[\d\.]+.*Safari/.test(userAgent);

  var PageState = (function (argument) {
    var restoreObj = {
      bodyProp: {},
      bodyClass: [],
      eventListener: [],
      scroll: {
        x: 0,
        y: 0
      }
    };

    var _PageState = {};

    _PageState.changeBodyProp = function (key, value) {
      restoreObj.bodyProp[key] = document.body.value;
      document.body[key] = value;
    };

    _PageState.addBodyClass = function (value) {
      var elementClassList = document.body.classList;
      if (elementClassList.contains(value)) {
        return;
      }
      restoreObj.bodyClass.push(value);
      elementClassList.add(value);
    };

    _PageState.addEventListener = function (el, eventName, callback) {
      if (window.addEventListener){
        el.addEventListener(eventName, callback, false);
      } else {
        attachEvent("on" + eventName, callback)
      }
      restoreObj.eventListener.push({
        el: el,
        eventName: eventName,
        callback: callback
      });
    };

    _PageState.setScroll = function () {
      if (!window.scrollX && !window.scrollY) {
        return;
      }
      restoreObj.scroll.x = window.scrollX;
      restoreObj.scroll.y = window.scrollY;
    };

    _PageState.restore = function () {
      var i;
      var listener;
      var bodyClass;
      var scrollX = restoreObj.scroll.x;
      var scrollY = restoreObj.scroll.y;

      for (i in restoreObj.bodyProp) {
        document.body[i] = restoreObj.bodyProp[i];
        delete restoreObj.bodyProp[i];
      }

      for (i in restoreObj.bodyClass) {
        bodyClass = restoreObj.bodyClass.pop();
        document.body.classList.remove(bodyClass);
      }

      for (i in restoreObj.eventListener) {
        listener = restoreObj.eventListener.pop();
        if (listener.el.removeEventListener) {
          listener.el.removeEventListener(listener.eventName, listener.callback);
        } else {
          listener.el.detachEvent("on" + listener.eventName, listener.callback); 
        }
      }

      if (window.scroll && (!scrollX || !scrollY)) {
        window.scroll(scrollX, scrollY);
      }
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
        Integration.close();
      }
    };

    _Message.listen = function () {
      PageState.addEventListener(window, "message", messageCallback);
    };

    return _Message;
  })();

  function createIframe () {
    var iframe = document.createElement("iframe");
    var props = {
      scrolling: "no",
      id: iframeId,
      src: "/iframe?accessId=" + accessId,
      frameborder: "0",
      allowtransparency: "true"
    };
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

    if (isIOS8) {
      PageState.addBodyClass("integration-ios8");
    }
    if (isSafari) {
      PageState.addBodyClass("integration-safari");
    }

    createIframe();

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

  return _Integration;
})();

