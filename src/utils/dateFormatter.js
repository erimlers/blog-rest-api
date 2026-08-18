const {format} = require("date-fns");
const {TZDate} = require("@date-fns/tz");

const toTurkeyDate = (date) =>{
    if(!date) return null;

    const turkeyDate = new TZDate(date, "Europe/Istanbul");
    return format(turkeyDate,"dd.MM.yyyy HH:mm:ss")

}

module.exports = {toTurkeyDate}