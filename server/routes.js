var express = require("express");
var router = express.Router();
// Controllers
var home = require("../controllers/home");
var payment = require("../controllers/payment"); 

// routing
router.get('/', home.index);
router.get('/payments', payment.index);
router.post('/payment/output', payment.output);
router.get('/payment/update/:id/:name', payment.updateGet);
router.post('/payment/update/post', payment.updatePost)

module.exports = router;