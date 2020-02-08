var time;
var targetText = 'çok kısa';
var audioUrl = 'https://notificationsounds.com/soundfiles/9cf81d8026a9018052c429cc4e56739b/file-sounds-1145-when.mp3';

function searcherVS() {

    var bodyText, searchText;

    bodyText = document.getElementsByTagName('body')[0].innerHTML;

    searchText = bodyText.indexOf(targetText);

    if (searchText !== -1) {

        new Audio(audioUrl).play();
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
