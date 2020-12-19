const mongoose = require('mongoose');

const BankSchema = new mongoose.Schema({
  bank_name: {
    type: String,
    required: true
  },
  account_number: {
    type: String,
    required: true
  },
  another_account:{
      type: String,
  },
  owner_email: {
    type: String,
    required: true
  },
  income: {
    type: String,
    required: true
  },
  outcome: {
    type: String,
    required: true
  }
});

const Bank = mongoose.model('Bank', BankSchema);

module.exports = Bank;
