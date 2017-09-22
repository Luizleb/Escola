var mysql = require("mysql");
var dateFormat = require("dateformat");
var numberFormat = require("format-number");
var studentId;
var studentName;

formatedNumber = numberFormat({decimal:',',integerSeparator:'.'});

module.exports = {
    index : function(req, res) {
        var db = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "escola"
        });
        db.query('SELECT id, reg_name FROM register ORDER BY reg_name; ', function(err, rows) {
            if (err) throw err;
            var context = {
                listNames: rows.map(function(list) {
                    return {
                        studentId: list["id"],
                        studentName: list["reg_name"]
                    }
                })
            };
            res.render('paymentInput', context);
        });
        db.end(function(err){
            if(err) throw err;
        });
    },

    updateGet : function(req, res) {
        studentId = req.params.id;
        studentName = req.params.name;
        var db = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "escola"
        });
        db.query('SELECT id, due_name FROM duedates; ', function(err, rows) {
            if (err) throw err;
            var context = {
                listDates: rows.map(function(list) {
                    return {
                        id: list["id"],
                        dateName: list["due_name"]
                    }
                }),
                id: studentId,
                name: studentName
            };
            res.render('paymentUpdate', context);
        });
        db.end(function(err){
            if(err) throw err;
        });
    },

    updatePost : function(req, res) {
        var data = {
            id: null,
            pay_reg_id: studentId,
            pay_due_date_id: req.body.mesId,
            pay_local: req.body.localName,
            pay_actual_date: req.body.date,
            pay_actual_interest: 0,
            pay_actual_value: req.body.payment,
            pay_status: 0,
            pay_remarks: "",
            pay_user: "LEB",
            pay_time_stamp: null
        };

        var con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'escola'
        });

        con.query('INSERT INTO payments SET ?', data, function(err) {
            if (err) throw err;
        });

        res.redirect(303, '/payment/update/' + studentId + '/' + studentName);

        con.end(function(err){
            if(err) throw err;
        });
    },

    output: function(req, res) {     
        var studentId = req.body.studentId;
        var db = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "escola",
            multipleStatements: true
        });
        var query = 'SELECT d.id, d.due_name, p.pay_actual_value, p.pay_actual_date FROM duedates d ' +
        'LEFT JOIN payments p ON d.id = p.pay_due_date_id AND p.pay_reg_id = ' + studentId + ' ORDER BY d.id;' +
        'SELECT reg_name FROM register WHERE id = ' + studentId + ';';
        db.query(query, function(err, rows) {
            if (err) throw err;
            var sumPayments = 0;
            var context = {
                id: studentId,
                results: rows[0].map(function (items) {
                    sumPayments += items["pay_actual_value"];
                    return {
                        month: items["due_name"],
                        value: formatedNumber((items["pay_actual_value"]*1).toFixed(2)),
                        date: dateFormat(items["pay_actual_date"],"dd-mm-yy")
                    }
                }),
                totalPayment: formatedNumber(sumPayments.toFixed(2)),
                name: rows[1].map(function(names) {
                    var name = names["reg_name"]
                    return name;
                })
            };
            res.render('paymentOutput', context);
        });
        db.end(function(err){
            if(err) throw err;
        });
    }
};