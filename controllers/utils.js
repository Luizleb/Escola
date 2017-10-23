var dateFormat = require("dateformat");
var numberFormat = require("format-number");

formatedNumber = numberFormat({
    decimal:',',
    integerSeparator:'.',
    truncate: 2
});

module.exports = {
    formatedDate: dateFormat,
    formatedNumber: formatedNumber
}