var express = require("express");
var router = express.Router();
// Controllers
var home = require("../controllers/home");
var payment = require("../controllers/payment");
var treasury = require("../controllers/treasury");

// basic routing
router.get('/', home.index);

// routing - Payments
router.get('/payments', payment.index);
router.post('/payment/output', payment.output);
router.get('/payment/update/:id/:name', payment.updateGet);
router.post('/payment/update/post', payment.updatePost)

// routing - Treasury
router.get('/treasury/update', treasury.index);
router.post('/treasury/output', treasury.output);


module.exports = router;