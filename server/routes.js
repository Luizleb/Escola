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
router.get('/payment', payment.index);
router.post('/payment/output', payment.output);
router.get('/payment/update/:id/:name', payment.updateGet);
router.post('/payment/update/post', payment.updatePost);
router.get('/payment/summary', payment.summary);

// routing - Treasury
router.get('/treasury/update', treasury.index);
router.post('/treasury/output', treasury.output);
router.get('/treasury/list/details', treasury.listDetails);
router.post('/treasury/list/details/output', treasury.listDetailsOutput);

// routing - Cash
router.get('/cash/input', cash.index);
router.get('/cash/money', cash.moneyInput);
router.get('/cash/vale', cash.valeInput);
router.get('/cash/check', cash.checkInput);
router.post('/cash/money/output', cash.moneyOutput);
router.post('/cash/vale/output', cash.valeOutput);
router.post('/cash/check/output', cash.checkOutput);

module.exports = router;