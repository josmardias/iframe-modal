var Integration = (function () {
  Lib = {};

  var iframeId = "integration";

  var _restore = {
    body: {}
  };

  var restore = function () {
    for (i in _restore.body) {
      document.body[i] = _restore.body[i];
      delete _restore.body[i];
    }
    return this;
  };

  Lib.init = function (accessId) {
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

    _restore.body.overflow = document.body.overflow;
    document.body.overflow = "hidden";
    document.body.appendChild(iframe);

    return this;
  };

  Lib.close = function () {
    restore();
    var iframe = document.getElementById(iframeId);
    var parent = iframe.parentNode;
    if(!parent) {
      return this;
    }
    parent.removeChild(iframe);
    return this;
  }

  return Lib;
})();
