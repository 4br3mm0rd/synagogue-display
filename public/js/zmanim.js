// Retrieve zmanim
function getZmanim(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:8080/zmanim", false);
    xhttp.send();
    var response = JSON.parse(xhttp.responseText);
    displayZmanim(response);
}

function handleZmanim(zmanim){
    var result = {};
    Object.keys(zmanim).forEach(function(key, index){
        console.log(key);
        var d = new Date(zmanim[key]);
        var hours = d.getHours();
        var mins = d.getMinutes() + 1;
        if(mins == 60) {
            mins = 0;
            hours +=  1;
        }
        if(hours == 25) hours = 1;
        if(hours < 10) hours = "0" + hours;
        if(mins < 10) mins = "0" + mins;
        result[key] = hours + ":" + mins;
    });
    return result;
}

// Display zmanim
function displayZmanim(zmanim){
    zmanim = handleZmanim(zmanim);
    document.querySelector('.time#alot').innerHTML = zmanim.alot;
    document.querySelector('.time#hatzot').innerHTML = zmanim.hatzot;
    document.querySelector('.time#minha').innerHTML = zmanim.minha;
    document.querySelector('.time#shkia').innerHTML = zmanim.shkia;
    document.querySelector('.time#candle').innerHTML = zmanim.candle;
    document.querySelector('.time#tzet').innerHTML = zmanim.tzet;
    console.log(zmanim.alot);
}

getZmanim();