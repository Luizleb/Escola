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

            res.render('treasuryInput', context);
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
    }
};