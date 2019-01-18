var indexszam = document.URL.indexOf("/");
var link = document.URL.slice(0,indexszam);

$(document).ready(function() {

$("#return_button").click(function () {
  window.location.href = link+"dashboard";
});

$("form").submit(function () {
  $("button[type='submit']").prop("disabled", true);
  return true;
});

$('.js-example-basic-multiple').select2();

$(function(){
  $("button[type='reset']").click(function(){
      $(".js-example-basic-multiple").select2('val', 'All');
  });
});

$("input[name='End_date']").datetimepicker({ });

$("input[name='Start_date']").datetimepicker({
  minDate: 0,
  onSelectDate:function(ct,$i){
    $("input[name='End_date']").datetimepicker('setOptions', { minDate: ct });
  },
  onSelectTime:function(ct,$i){
    $("input[name='End_date']").datetimepicker('setOptions', { minTime: ct });
  }
});

});