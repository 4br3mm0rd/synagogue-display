const { ComplexZmanimCalendar, getZmanimJson } = require("kosher-zmanim");
const Hebcal = require('hebcal');
const months = require('../helpers/jewish-months');
const days = require('../helpers/days');
const gregmonths = require('../helpers/gregorian-months');

function hdatecmp(hdate1, hdate2){
    return hdate1.day == hdate2.day && hdate1.month == hdate2.month && hdate1.year == hdate2.year;
}

function isRoshHodesh(hdate){
    var next_month = hdate.month + 1;
    if(next_month == 13 && !hdate.isLeapYear()) next_month = 1;
    if(next_month == 14) next_month = 1;

    var this_rosh_hodesh = (new Hebcal.Month(hdate.month, hdate.year)).rosh_chodesh();
    var next_rosh_hodesh = (new Hebcal.Month(next_month, hdate.year)).rosh_chodesh();

    if(hdatecmp(hdate, this_rosh_hodesh)) return true;
    if(hdatecmp(hdate, next_rosh_hodesh)) return true;

    return false;
}

function getEvent(hdate){
    var holidays_this_month = new Hebcal.Month(hdate.month, hdate.year).holidays;
    for(const event in holidays_this_month){
        if(hdatecmp(hdate, holidays_this_month[event][0].date)) return holidays_this_month[event][0].desc;
    }
    return null;
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
        var result = {
            alot: zmanim.AlosHashachar,
            hatzot: zmanim.Chatzos,
            minha: zmanim.MinchaGedola,
            candle: zmanim.CandleLighting,
            shkia: zmanim.Sunset,
            tzet: zmanim.Tzais,
            havdallah: zmanim.Havdallah
        };
        //TODO: compute real zman of havdallah and candle light
        return result;
    },

    date: function(date){
        var hdate = Hebcal.HDate(date);

        return {
            date: date,
            dayOfWeek: hdate.getDay(),
            day: hdate.day,
            dayFR: days.french[hdate.getDay() - 1],
            dayHE: days.hebrew[hdate.getDay() - 1],
            gmonthFR: gregmonths.french[date.getMonth()],
            gmonthHE: gregmonths.hebrew[date.getMonth()],
            monthFR: months.french[hdate.month - 1],
            monthHE: months.hebrew[months.french[hdate.month - 1]],
            year: hdate.year,
            parasha: hdate.getSedra('h'),
            rosh_hodesh: isRoshHodesh(hdate),
            event: getEvent(hdate)
        };
    }
};