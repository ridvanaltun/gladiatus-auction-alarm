var time;
var parseText = "eşyası için vermiş olduğun teklif geçildi.";

function check() {

    var bodyText, searchText;

    bodyText = document.getElementsByTagName("body")[0].innerHTML;

    searchText = bodyText.indexOf(parseText);

    if (searchText !== -1) {

       new Audio('http://p.esy.es/stuffed-and-dropped.mp3').play();
       refresh(3);

    } else
        refresh(6);

}

function refresh(time) {

    setTimeout(function() { location.reload(); }, time * 1000);
}

check();
