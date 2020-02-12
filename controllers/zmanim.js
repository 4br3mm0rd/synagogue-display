const { ComplexZmanimCalendar, getZmanimJson } = require("kosher-zmanim");
const Hebcal = require('hebcal');
const months = require('../helpers/jewish-months');

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
            tzet: zmanim.Tzais
        };
        return result;
    },

    date: function(date){
        var hdate = Hebcal.HDate(new Date("April 8, 2020"));
        hdate.setCity('Ramat Gan');
        hdate.setLocation(32, 35);
        return {
            date: date,
            dayOfWeek: hdate.getDay(),
            day: hdate.day,
            monthFR: months.french[hdate.month - 1],
            monthHE: months.hebrew[months.french[hdate.month - 1]],
            year: hdate.year,
            parasha: hdate.getSedra('h')
        };
    }
};