var time;
var parseText = "çok kısa";

function searcherVS() {

    var bodyText, searchText;

    bodyText = document.getElementsByTagName("body")[0].innerHTML;

    searchText = bodyText.indexOf(parseText);

    if (searchText !== -1) {

        new Audio('http://p.esy.es/pitched-so-high.mp3').play();
        refresh(5);

    } else
        refresh(7);
}

function refresh(time) {

    setTimeout(function() {
        location.reload();
    }, time * 1000);
}

searcherVS();
