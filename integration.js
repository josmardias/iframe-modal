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
      el.addEventListener("eventName", callback);
      restoreObj.eventListener.push({
        el: el,
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
        listener.el.removeEventListener(listener.callback);
      }

      if (window.scroll && (!scrollX || !scrollY)) {
        window.scroll(scrollX, scrollY);
      }
    };

    return _PageState;
  })();

  _Integration.init = function (accessId) {
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

    PageState.setScroll(); // must be before adding body classes

    PageState.changeBodyProp("overflow", "hidden");
    PageState.addBodyClass("integration-noscroll");

    if (isIOS8) {
      PageState.addBodyClass("integration-ios8");
    }
    if (isSafari) {
      PageState.addBodyClass("integration-safari");
    }

    document.body.appendChild(iframe);

    return this;
  };

  _Integration.close = function () {
    PageState.restore();
    var iframe = document.getElementById(iframeId);
    var parent = iframe.parentNode;
    if (!parent) {
      return this;
    }
    parent.removeChild(iframe);
    return this;
  }

  return _Integration;
})();

