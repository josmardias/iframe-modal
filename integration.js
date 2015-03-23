var Integration = (function () {
  var _Integration = {};

  var iframeId = "integration";

  var PageState = (function (argument) {
    var restoreObj = {
      body: {}
    };

    var _PageState = {};

    _PageState.changeBodyProp = function (key, value) {
      restoreObj.body.key = document.body.value;
      document.body.key = value;
    };

    _PageState.restore = function () {
      for (i in restoreObj.body) {
        document.body[i] = restoreObj.body[i];
        delete restoreObj.body[i];
      }
      return this;
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

    PageState.changeBodyProp("overflow", "hidden");
    document.body.appendChild(iframe);

    return this;
  };

  _Integration.close = function () {
    PageState.restore();
    var iframe = document.getElementById(iframeId);
    var parent = iframe.parentNode;
    if(!parent) {
      return this;
    }
    parent.removeChild(iframe);
    return this;
  }

  return _Integration;
})();
