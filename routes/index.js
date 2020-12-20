const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Bank = require('../models/Bank');


// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('login'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
// Bank.findOne({}).then(
  res.render('dashboard', {
    user: req.user,
    // banks: req.banks
  })
);


module.exports = router;
