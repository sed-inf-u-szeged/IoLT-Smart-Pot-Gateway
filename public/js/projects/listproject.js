var indexszam = document.URL.indexOf("/");
var link = document.URL.slice(0,indexszam);


$("#return_button").click(function () {
  window.location.href = link+"dashboard";
});

$("form").submit(function () {
  $("button[type='submit']").prop("disabled", true);
  return true;
});

$('.inline_button_menu').click(function() {
  $('.inline_button_menu').prop('disabled',true);
});