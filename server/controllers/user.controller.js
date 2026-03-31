import User from '../models/user.model.js';
import Account from '../models/account.model.js';
import Transaction from '../models/transaction.model.js';
import PlaidItem from '../models/plaid-item.model.js';

export const getUser = async (req, res) => {
    try {
        const id = req.user._id;
        const user = await User.findById(id).select('-password');
        const hasBankLinked = await PlaidItem.exists({ user: id });
        res.status(200).send({success: true, data: {...user.toObject(), hasBankLinked: !!hasBankLinked}});
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({
      userId: req.user._id,
    });
    res.status(200).send({success: true, data: accounts});
  } catch (error) {
    res.status(500).send({success: false, message: error.message}); 
  }
}

export const getTransactions = async (req, res) => {
  try {
    const { limit, accountId } = req.query;
    const query = { userId: req.user._id };
    
    if (accountId) {
      query.accountId = accountId;
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit) || 10);

    res.status(200).send({success: true, data: transactions});
  } catch (error) {
    res.status(500).send({success: false, message: error.message});
  }
}
