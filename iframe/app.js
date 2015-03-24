(function ($, jQuery, undefined) {

  $("#form1").on("submit", function (event) {
    event.preventDefault();
  });

  $("#close").on("click", function (event) {
    event.preventDefault();
    Panel.close();
  });

})(jQuery, jQuery);

