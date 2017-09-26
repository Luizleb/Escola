var mysql = require('mysql');

module.exports = {
    index: function (req, res) {
        var con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'escola'
        });

        con.query('select * from account order by acc_cat_id', function (err, rows) {
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

        con.end(function (err) {
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

        var con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'escola'
        });

        con.query('INSERT INTO treasury SET ?', data, function(err) {
            if (err) throw err;
        });

        res.redirect(303, '/treasury/update');

        con.end(function(err){
            if(err) throw err;
        });
    },
    listDetails: function(req, res) {
        res.render('treasuryListInput');
    },
    listDetailsOutput: function(req, res) {
        var con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'escola',
            dateStrings: 'date'
        });

        var date_init;
        var date_end;
        var date_label_init, date_label_end;
        var queryString =  '';

        if (req.body.date_init === '') {
            date_init = '2000-01-01';
            date_label_init = "Tudo";
        } else {
            date_init = req.body.date_init;
            date_label_init = date_init;
        }

        if (req.body.date_end === '') {
            date_end = '2100-01-01';
            date_label_end = "Tudo";
        } else {
            date_end = req.body.date_end;
            date_label_end = date_end;
        }

        queryString = 'SELECT t.tre_description, t.tre_date, t.tre_value, t.tre_user, a.acc_name,' +
            'm.met_name, c.cat_name, c.cat_type FROM treasury t INNER JOIN account a ON t.tre_acc_id = a.id' +
            ' INNER JOIN method m ON t.tre_met_id = m.id INNER JOIN category c ON a.acc_cat_id = ' +
            'c.id WHERE t.tre_date >="' + date_init + '"AND t.tre_date <= "' + date_end + '"';

        con.query(queryString, function(err, rows) {
            if (err) throw err;
            var sum = 12683.05;
            var context = {
                period: {
                    init: date_label_init,
                    end: date_label_end
                },
                results: rows.map(function (items) {
                    var value_currency = ((items["tre_value"])*1).toFixed(2);
                    if (items.cat_type === 'D') {
                        items.tra_value *= -1;
                    }
                    sum += items.tre_value;
                    return {
                        description: items["tre_description"],
                        account: items["acc_name"],
                        date: items["tre_date"],
                        value: value_currency,
                        method: items["met_name"],
                        user: items["tre_user"],
                        category: items["cat_name"],
                        type: items["cat_type"]
                    }
                }),
                total: sum.toFixed(2)
            };
            res.render('treasuryListOutput', context);
        });

        con.end(function(err){
            if(err) throw err;
        });
    }
};