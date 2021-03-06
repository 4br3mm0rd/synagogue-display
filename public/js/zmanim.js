var tzet = null;
var showingTomorrow = false;
// Retrieve zmanim
function getZmanim(){
    var url = "http://localhost:8080/zmanim"
    console.log(url);
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.send();
    var response = JSON.parse(xhttp.responseText);
    displayZmanim(response);
}

function handleZmanim(zmanim){
    var result = {};
    Object.keys(zmanim).forEach(function(key, index){
        var d = new Date(zmanim[key]);
        var hours = d.getHours();
        var mins = d.getMinutes() + 1;
        if(key == "candle" || key == "havdallah") mins--; // Not adding 1 min to candle lighting (and our havdallah because our computing is already late)
        if(mins == 60) {
            mins = 0;
            hours +=  1;
        }
        if(hours == 25) hours = 1;
        if(hours < 10) hours = "0" + hours;
        if(mins < 10) mins = "0" + mins;
        result[key] = hours + ":" + mins;
        if(key == "havdallah") tzet = new Date(zmanim[key]);
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
    document.querySelector('.time#havdallah').innerHTML = zmanim.havdallah;
}

// Retrieve date info
function getDateInfo(){
    var url = "http://localhost:8080/zmanim/date";
    if(showingTomorrow) url += "/tomorrow";
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.send();
    var response = JSON.parse(xhttp.responseText);
    displayDate(response);
}

// Display date
function displayDate(info){
    var gdate = new Date(info.date);

    // Gregorian Date
    document.querySelector(".gyearFR").innerHTML = gdate.getFullYear();
    document.querySelector(".gdayFR").innerHTML = gdate.getDate();
    document.querySelector(".gyearHE").innerHTML = gdate.getFullYear();
    document.querySelector(".gdayHE").innerHTML = gdate.getDate();
    document.querySelector(".dayofweekFR").innerHTML = info.dayFR;
    document.querySelector(".dayofweekHE").innerHTML = info.dayHE;
    document.querySelector(".gmonthFR").innerHTML = info.gmonthFR;
    document.querySelector(".gmonthHE").innerHTML = info.gmonthHE;

    // Hebrew Date
    document.querySelector(".hyearFR").innerHTML = info.year;
    document.querySelector(".hdayFR").innerHTML = info.day;
    document.querySelector(".hyearHE").innerHTML = info.year;
    document.querySelector(".hdayHE").innerHTML = info.day;
    document.querySelector(".hmonthFR").innerHTML = info.monthFR;
    document.querySelector(".hmonthHE").innerHTML = info.monthHE;

    // Festivals
    if(info.eventText.english != ""){
        document.querySelector("#festival-hebrew").innerHTML = info.eventText.hebrew;
        document.querySelector("#festival-french").innerHTML = info.eventText.english;
    }
    else{
        document.querySelector("#festival-hebrew").innerHTML = "-";
        document.querySelector("#festival-french").innerHTML = "-";
    }

    // Parasha
    var parasha = "";
    for(i=0; i<info.parasha.length; i++){
        parasha += info.parasha[i] + " ";
    }
    document.querySelector("#parasha-french").innerHTML = "Parasha: " + info.parashaFR;
    document.querySelector("#parasha-hebrew").innerHTML = "פרשה: " + info.parasha;
}

// TODO: when tzait hakochavim is passed, go to next day
// TODO: timer :)

getZmanim();
getDateInfo();

// Clock handling
function refreshClock(){
    var time = new Date();
    var seconds = time.getSeconds();
    var min = time.getMinutes();
    var hours = time.getHours();
    if(min < 10) min = "0" + min;
    if(hours < 10) hours = "0" + hours;

    document.querySelector(".clock .hours").innerHTML = hours;
    document.querySelector(".clock .min").innerHTML = min;
    if(seconds % 2 == 0) document.querySelector(".clock .dots").style = "opacity: 0";
    else document.querySelector(".clock .dots").style = "opacity: 1";
}
window.setInterval(refreshClock, 1000);

// Auto update zmanim
function autoUpdate(){
    if(tzet == null) return;
    var time = new Date();
    if(showingTomorrow && time.getHours() == 0){
        showingTomorrow = false;
        getZmanim();
        getDateInfo();
    }
    else if((tzet.getHours() < time.getHours()) || (tzet.getHours() == time.getHours() && tzet.getMinutes() < time.getMinutes())){
        showingTomorrow = true;
        getZmanim();
        getDateInfo();
    }
}
window.setInterval(autoUpdate, 5000);