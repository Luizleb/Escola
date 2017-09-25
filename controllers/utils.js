var dateFormat = require("dateformat");
var numberFormat = require("format-number");

formatedNumber = numberFormat({decimal:',',integerSeparator:'.'});

module.exports = {
    formatedDate: dateFormat,
    formatedNumber: formatedNumber
}