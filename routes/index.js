const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Bank = require('../models/Bank');


// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('login'));

// Dashboard
router.get('/dashboard', ensureAuthenticated,async (req, res) =>{
  let bank_info = await Bank.find({owner_email: req.user.email});
  console.log(bank_info);
  res.render('dashboard', {
    user: req.user,
    banks: bank_info
  });
});


module.exports = router;
