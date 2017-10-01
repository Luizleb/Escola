var mysql = require("../server/mysql");

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

        mysql.poolStd.getConnection(function(err,conn){
            conn.query('INSERT INTO cash SET ?', data, function(err) {
                if (err) throw err;
            });
    
            res.redirect(303, '/cash/input/');
    
            conn.release();
            if(err) throw err;
        });     
    },
    valeOutput: function(req, res) {
        var data = {
            id: null,
            date_in: req.body.date,
            date_out: null,
            description: req.body.description,
            value: req.body.value,
            status: true
        };

        mysql.poolStd.getConnection(function(err,conn){
            conn.query('INSERT INTO vale SET ?', data, function(err) {
                if (err) throw err;
            });
    
            res.redirect(303, '/cash/input/');
    
            conn.release();
            if(err) throw err;
        });
    },
    checkOutput: function(req, res) {
        var data = {
            id: null,
            description: req.body.description,
            date_in: req.body.date,
            date_out: null,
            bank: req.body.bank,
            number: req.body.number,
            type: req.body.type ,        
            value: req.body.value,
            status: 1
        };

        mysql.poolStd.getConnection(function(err, conn){
            conn.query('INSERT INTO cheque SET ?', data, function(err) {
                if (err) throw err;
            });
    
            res.redirect(303, '/cash/input/');
    
            conn.release();
            if(err) throw err;
        });
    }
}