var mysql = require("mysql");

var poolStd = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'escola'
});

var poolMul = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'escola',
    multipleStatements: true
});

module.exports = {
    poolStd: poolStd,
    poolMul: poolMul
};