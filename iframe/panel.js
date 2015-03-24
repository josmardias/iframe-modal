var Panel = (function () {
  var _Panel = {};

  _Panel.close = function (argument) {
    parent.postMessage("integration:close", "*");
    return this;
  };

  return _Panel;
})();

