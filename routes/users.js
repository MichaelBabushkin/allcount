const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const Bank = require('../models/Bank');
const { forwardAuthenticated,ensureAuthenticated } = require('../config/auth');



/**
function that returns random number in the given range
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Add Account Page
router.get('/add_account/:email',ensureAuthenticated, (req, res) =>  {
  res.render('add_bank_account',{email:req.params.email})
});

// Get Data From Database
router.get('/get_account_data', forwardAuthenticated, (req, res) => res.render('dashboard'));


// Register
router.post('/register', forwardAuthenticated, (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can add acoount details'
                );

                // res.redirect( `/users/add_account/${email}` );
                res.redirect( `/users/login` );


              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});
// Add Bank Account
router.post('/add_account', ensureAuthenticated, (req, res) => {
 const { bank_name, account_number ,another_account, owner_email, income, outcome } =  req.body;

  let errors = [];
  // if (!bank_name || !account_number|| !owner_email || !income || !outcome) {
  if (!bank_name || !account_number || owner_email) {
    errors.push({ msg: 'Please enter all fields' });
  }
  let checkedValue = req.body['another_account'];


  const newBank = new Bank({
    bank_name,
    account_number,
    owner_email,
    income:getRandomInt(3000,12000),
    outcome:getRandomInt(2000,9000),
    credit_debt:getRandomInt(200,1300),
    loan:getRandomInt(500,6300)
  });

  newBank.save().then(bank => {
                req.flash(
                  'success_msg',
                  'Your Bank account added to the dashboard successfully!'
                );
                if(checkedValue=='on'){
                  res.redirect(`/users/add_account/${owner_email}`);
                }else{
                  res.redirect('/users/login');
                }
})
.catch(err => console.log(err));
});


/* DELETE User BY Email */
router.get('/delete/:account_number', async function(req, res) {
  let account = await Bank.find({account_number: req.params.account_number});
  console.log(account)
  Bank.findOneAndDelete({account_number:req.params.account_number}, function (err) {
    if (err) {
      req.flash('error_msg', 'Record Not Deleted');
      res.redirect('/dashboard');
    } else {

      req.flash('success_msg', 'Record Deleted');
      res.redirect('/dashboard');
    }
  });
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
