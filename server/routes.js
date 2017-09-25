var express = require("express");
var router = express.Router();
// Controllers
var home = require("../controllers/home");
var payment = require("../controllers/payment");
var treasury = require("../controllers/treasury");
var cash = require("../controllers/cash");

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

// routing - Cash
router.get('/cash/input', cash.index);
router.get('/cash/money', cash.moneyInput);
router.get('/cash/vale', cash.valeInput);
router.get('/cash/check', cash.checkInput);
router.post('/cash/money/output', cash.moneyOutput);
router.post('/cash/vale/output', cash.valeOutput);
router.post('/cash/check/output', cash.checkOutput);

module.exports = router;