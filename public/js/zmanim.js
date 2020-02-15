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
}

// Retrieve date info
function getDateInfo(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:8080/zmanim/date", false);
    xhttp.send();
    var response = JSON.parse(xhttp.responseText);
    displayDate(response);
}

// Display date
function displayDate(info){
    var gdate = new Date();

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
    if(info.event != null){
        document.querySelector("#festival-hebrew").innerHTML = info.event[2];
        document.querySelector("#festival-french").innerHTML = info.event[0];
    }
    else{
        document.querySelector("#festival-hebrew").innerHTML = "";
        document.querySelector("#festival-french").innerHTML = "";
    }

    // Parasha
    var parasha = "";
    for(i=0; i<info.parasha.length; i++){
        parasha += info.parasha[i] + " ";
    }
    document.querySelector("#parasha-french").innerHTML = info.parasha[0];
    document.querySelector("#parasha-hebrew").innerHTML = info.parasha[0];
}

getZmanim();
getDateInfo();