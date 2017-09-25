var mysql = require("mysql");

module.exports = {
    index: function(req, res) {
        res.render('cashInput');
    },
    moneyInput: function(req, res) {
        res.render('moneyInput');
    },
    valeInput: function(req, res) {
        res.render('valeInput');
    },
    checkInput: function(req, res) {
        res.render('checkInput');
    },
    moneyOutput: function(req, res) {
        var data = {
            id: null,
            date: req.body.date,
            b2: req.body.bill2,
            b5: req.body.bill5,
            b10: req.body.bill10,
            b20: req.body.bill20,
            b50: req.body.bill50,
            b100: req.body.bill100,
            c005: req.body.coin5,
            c010: req.body.coin10,
            c025: req.body.coin25,
            c050: req.body.coin50,
            c100: req.body.coin100
        };

        var con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'escola'
        });

        con.query('INSERT INTO cash SET ?', data, function(err) {
            if (err) throw err;
        });

        res.redirect(303, '/cash/input/');

        con.end(function(err){
            if(err) throw err;
        });
    }
}