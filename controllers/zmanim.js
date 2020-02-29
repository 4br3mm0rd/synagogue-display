const { ComplexZmanimCalendar, getZmanimJson } = require("kosher-zmanim");
const Hebcal = require('hebcal');
const months = require('../helpers/jewish-months');
const days = require('../helpers/days');
const gregmonths = require('../helpers/gregorian-months');

function hdatecmp(hdate1, hdate2){
    return hdate1.day == hdate2.day && hdate1.month == hdate2.month && hdate1.year == hdate2.year;
}

// function isRoshHodesh(hdate){
//     var next_month = hdate.month + 1;
//     if(next_month == 13 && !hdate.isLeapYear()) next_month = 1;
//     if(next_month == 14) next_month = 1;

//     var this_rosh_hodesh = (new Hebcal.Month(hdate.month, hdate.year)).rosh_chodesh();
//     var next_rosh_hodesh = (new Hebcal.Month(next_month, hdate.year)).rosh_chodesh();

//     if(hdatecmp(hdate, this_rosh_hodesh)) return true;
//     if(hdatecmp(hdate, next_rosh_hodesh)) return true;

//     return false;
// }

function getEvents(hdate){
    var holidays_this_month = new Hebcal.Month(hdate.month, hdate.year).holidays;
    for(const event in holidays_this_month){
        if(hdatecmp(hdate, holidays_this_month[event][0].date)) {
            return holidays_this_month[event];
        }
    }
    return [];
}

function isRoshHodesh(hdate){
    var events = getEvents(hdate);
    for(var i=0; i<events.length; i++){
        if(events[i].desc[0].includes("Rosh Chodesh")) return true;
    }
    return false;
}

function getEventText(hdate){
    var events = getEvents(hdate);
    var result = {hebrew: "", english: ""};
    for(var i=0;i<events.length;i++){
        if(i > 0){
            result["hebrew"] += " - ";
            result["english"] += " - ";
        }
        result["hebrew"] += events[i].desc[2];
        result["english"] += events[i].desc[0];
    }
    return result;
}

function getNextHavdallahAndLightingTime(date){
    var hdate = Hebcal.HDate(date).prev();
    var hasHavdallah = false;
    var result = {havdallah: null, candles: null};
    while(!hasHavdallah){
        hdate = hdate.next();
        var events = getEvents(hdate);
        for(var i=0;i<events.length; i++){
            if(events[i].havdalah()) hasHavdallah = true;
        }
    }
    var options = {
        date: hdate.greg(),
        timeZoneId: "Asia/Jerusalem",
        locationName: "Ramat Gan",
        latitude: 32,
        longitude: 35,
        elevation: 80,
        complex: true
    };
    var zmanim = getZmanimJson(options).BasicZmanim;
    result.havdallah = zmanim.EndNauticalTwilight;
    options.date = hdate.gregEve();
    zmanim = getZmanimJson(options).BasicZmanim;
    result.candles = zmanim.CandleLighting;
    return result;
}

module.exports = {
    zmanim: function(date){
        var options = {
            date: date,
            timeZoneId: "Asia/Jerusalem",
            locationName: "Ramat Gan",
            latitude: 32,
            longitude: 35,
            elevation: 80,
            complex: true
        };
        var zmanim = getZmanimJson(options).BasicZmanim;
        var specialTimes = getNextHavdallahAndLightingTime(date);
        var result = {
            alot: zmanim.AlosHashachar,
            hatzot: zmanim.Chatzos,
            minha: zmanim.MinchaGedola,
            candle: specialTimes.candles,
            shkia: zmanim.Sunset,
            tzet: zmanim.Tzais,
            havdallah: specialTimes.havdallah
        };
        //TODO: compute real zman of havdallah and candle light
        return result;
    },

    date: function(date){
        //date = new Date("December 23 2019");
        var hdate = Hebcal.HDate(date);
        var day = hdate.getDay() == 0 ? 6:hdate.getDay()- 1;
        return {
            date: date,
            dayOfWeek: hdate.getDay(),
            day: hdate.day,
            dayFR: days.french[day],
            dayHE: days.hebrew[day],
            gmonthFR: gregmonths.french[date.getMonth()],
            gmonthHE: gregmonths.hebrew[date.getMonth()],
            monthFR: months.french[hdate.month - 1],
            monthHE: months.hebrew[months.french[hdate.month - 1]],
            year: hdate.year,
            parasha: hdate.getSedra('h'),
            parashaFR: hdate.getSedra('o'),
            rosh_hodesh: isRoshHodesh(hdate),
            events: getEvents(hdate),
            eventText: getEventText(hdate)
        };
    }
};