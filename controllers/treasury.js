var mysql = require('../server/mysql');
var utils = require("./utils");

module.exports = {
    index: function (req, res) {
        mysql.poolStd.getConnection(function(err, conn){
            conn.query('select * from account order by acc_cat_id', function (err, rows) {
                if (err) throw err;
                var context = {
                    accountList: rows.map(function (list) {
                        return {
                            accountId: list["id"],
                            accountName: list["acc_name"]
                        }
                    })
                };
    
                res.render('treasuryUpdate', context);
            });
    
            conn.release();
            if (err) throw err;
        });
    },

    output: function(req, res) {
        var data = {
            id: null,
            tre_description: req.body.description,
            tre_acc_id: req.body.accountId,
            tre_met_id: req.body.methodId,
            tre_date: req.body.date,
            tre_value: req.body.value,
            tre_user: "Leb",
            tre_timestamp: null
        };

        mysql.poolStd.getConnection(function(err,conn){
            conn.query('INSERT INTO treasury SET ?', data, function(err) {
                if (err) throw err;
            });
    
            res.redirect(303, '/treasury/update');
    
            conn.release();
            if(err) throw err;
        });
    },
    listDetails: function(req, res) {
        res.render('treasuryListInput');
    },
    listDetailsOutput: function(req, res) {
        mysql.poolStd.getConnection(function(err,conn){
            var date_init;
            var date_end;
            var date_label_init, date_label_end;
            var queryString =  '';
            var initial_balance = 12683.05;
    
            if (req.body.date_init === '') {
                date_init = '2000-01-01';
                date_label_init = "Tudo";
            } else {
                date_init = req.body.date_init;
                date_label_init = utils.formatedDate(date_init,"dd-mm-yy",true);
            }
    
            if (req.body.date_end === '') {
                date_end = '2100-01-01';
                date_label_end = "Tudo";
            } else {
                date_end = req.body.date_end;
                date_label_end = utils.formatedDate(date_end,"dd-mm-yy",true);
            }
    
            queryString = 'SELECT t.tre_description, t.tre_date, t.tre_value, t.tre_user, a.acc_name,' +
                'm.met_name, c.cat_name, c.cat_type FROM treasury t INNER JOIN account a ON t.tre_acc_id = a.id' +
                ' INNER JOIN method m ON t.tre_met_id = m.id INNER JOIN category c ON a.acc_cat_id = ' +
                'c.id WHERE t.tre_date >="' + date_init + '"AND t.tre_date <= "' + date_end + '" ORDER BY t.tre_date, c.cat_type desc';
    
            conn.query(queryString, function(err, rows) {
                if (err) throw err;
                var sum = initial_balance;
                var context = {
                    balance: utils.formatedNumber(initial_balance),
                    period: {
                        init: date_label_init,
                        end: date_label_end
                    },
                    results: rows.map(function (items) {
                        var value_currency = ((items["tre_value"])*1).toFixed(2);
                        if (items.cat_type === 'D') {
                            items.tre_value *= -1;
                        }
                        sum += items.tre_value;
                        return {
                            description: items["tre_description"],
                            account: items["acc_name"],
                            date: utils.formatedDate(items["tre_date"],"dd-mm-yy", true),
                            value: utils.formatedNumber(value_currency),
                            method: items["met_name"],
                            user: items["tre_user"],
                            category: items["cat_name"],
                            type: items["cat_type"]
                        }
                    }),
                    total: utils.formatedNumber(sum.toFixed(2))
                };
                res.render('treasuryListOutput', context);
            });
    
            conn.release();
            if(err) throw err;
        });
    }
};