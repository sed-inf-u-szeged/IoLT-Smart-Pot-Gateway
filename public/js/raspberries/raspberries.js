var indexszam = document.URL.indexOf("/");
var link = document.URL.slice(0,indexszam);

$("#return_button").click(function () {
  window.location.href = link+"dashboard";
});

$('button').click(function() {
  $('button').prop('disabled',true);
});
