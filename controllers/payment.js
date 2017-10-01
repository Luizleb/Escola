var mysql = require("../server/mysql");
var utils = require("./utils");
var studentId;
var studentName;

module.exports = {
    index : function(req, res) {
        mysql.poolStd.getConnection(function(err,conn){
            conn.query('SELECT id, reg_name FROM register ORDER BY reg_name; ', function(err, rows) {
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
            conn.release();
            if(err) throw err;
        }); 
    },

    updateGet : function(req, res) {
        studentId = req.params.id;
        studentName = req.params.name;
        mysql.poolStd.getConnection(function(err,conn){
            conn.query('SELECT id, due_name FROM duedates; ', function(err, rows) {
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
            conn.release();
            if(err) throw err;
        });
    },

    updatePost : function(req, res) {
        var dataPay = {
            id: null,
            pay_reg_id: studentId,
            pay_due_date_id: req.body.mesId,
            pay_local: req.body.localName,
            pay_actual_date: req.body.date,
            pay_actual_interest: 0,
            pay_actual_value: req.body.payment,
            pay_method: req.body.forma,
            pay_status: 0,
            pay_remarks: "",
            pay_user: "LEB",
            pay_time_stamp: null
        };

        mysql.poolStd.getConnection(function(err,conn){
            if((req.body.forma === "1") || (req.body.forma === "2")) {
                var dataTre = {
                    id: null,
                    tre_description: "Mensalidade - Tesouraria",
                    tre_acc_id: 1,
                    tre_met_id: req.body.forma,
                    tre_date: req.body.date,
                    tre_value: req.body.payment,
                    tre_user: "Leb",
                    tre_timestamp: null
                };
                conn.query('INSERT INTO treasury SET ?', dataTre, function(err) {
                    if (err) throw err;
                });
            }
    
            conn.query('INSERT INTO payments SET ?', dataPay, function(err) {
                if (err) throw err;
            });
    
            res.redirect(303, '/payment/update/' + studentId + '/' + studentName);
    
            conn.release();
            if(err) throw err;
        });
    },

    output: function(req, res) {     
        var id = req.body.studentId;
        var name = req.body.studentName;
        mysql.poolStd.getConnection(function(err,conn){
            var query = 'SELECT d.id, d.due_name, d.due_date, '+
            't.tui_value*(1-r.reg_discount) as net, p.pay_actual_value, p.pay_actual_date '+
            'FROM duedates d '+
                'INNER JOIN register r ON r.id = '+ id +
                ' INNER JOIN grade g ON r.reg_grade = g.id '+
                'INNER JOIN tuition t ON g.id = t.tui_grade_id '+
                'LEFT JOIN payments p ON d.id = p.pay_due_date_id AND p.pay_reg_id = '+ id +
                ' ORDER BY d.id;';
            conn.query(query, function(err, rows) {
                if (err) throw err;
                var sumPayments = 0;
                var context = {
                    id: id,
                    name: name,
                    results: rows.map(function (items) {
                        sumPayments += items["pay_actual_value"];
                        if(items["pay_actual_date"] != null) {
                            items["pay_actual_date"] = utils.formatedDate(items["pay_actual_date"],"dd-mm-yy", true);
                        }
                        return {
                            month: items["due_name"],
                            dateDue: utils.formatedDate(items["due_date"],"dd-mm-yy", true),
                            valueDue: utils.formatedNumber((items["net"]*1).toFixed(2)),
                            datePaid: items["pay_actual_date"],
                            valuePaid: utils.formatedNumber((items["pay_actual_value"]*1).toFixed(2)),
                        }
                    }),
                    totalPayment: utils.formatedNumber(sumPayments.toFixed(2)),
                };
                res.render('paymentOutput', context);
            });
            conn.release();
            if(err) throw err;
        });
    },
    summary: function(req, res){
        mysql.poolMul.getConnection(function(err, conn){
            var query1 = 'SELECT d.due_name, sum(p.pay_actual_value) as total ' +
            'FROM duedates d ' +
                'LEFT JOIN payments p ON d.id = p.pay_due_date_id ' +
                'GROUP BY due_name '+
                'ORDER BY d.id;';
            var query2 = 'SELECT month(p.pay_actual_date) as month, sum(p.pay_actual_value) as total ' + 
            'FROM payments p ' +
            'GROUP BY month(p.pay_actual_date);';
            conn.query(query1 + query2, function(err, rows) {
                if (err) throw err;
                var totalDist = 0;
                var totalPay = 0;
                var context = {
                    tuitionDist: rows[0].map(function (items) {
                        totalDist += items["total"];
                        return {
                            month: items["due_name"],
                            total: utils.formatedNumber((items["total"]).toFixed(2))
                        }
                    }),
                    tuitionPay: rows[1].map(function (items) {
                        totalPay += items["total"];
                        return {
                            month: items["month"],
                            total: utils.formatedNumber((items["total"]).toFixed(2))
                        }
                    }),
                    totalDist: utils.formatedNumber(totalDist),
                    totalPay: utils.formatedNumber(totalPay )
                };
                res.render('paymentSummary', context);
            });
            conn.release();
            if(err) throw err;
        });
    }
};