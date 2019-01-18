var indexszam = document.URL.indexOf("/");
var link = document.URL.slice(0,indexszam);

$(' footer button ').click(function () {
    window.location.href = link+"dashboard";
});