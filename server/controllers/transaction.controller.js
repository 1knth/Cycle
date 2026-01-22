const Transactions = require('../models/transactionModel.js');

exports.addTransaction = async (req, res) => {
    // 1. Map the data correctly (Your schema expects 'transactionId', not 'id')
    const transactionObj = {
        transactionId: req.body.transactionId, // FIXED: Changed 'id' to 'transactionId'
        account: req.body.account,
        name: req.body.name,
        amount: req.body.amount,
        date: req.body.date,
        category: req.body.category,
        pending: req.body.pending
    };

    try {
        // 2. FIXED: Use 'transactionObj', not 'restaurantObj'
        const transaction = await Transactions.create(transactionObj);
        
        // 3. FIXED: Send back 'transaction', not 'restaurant'
        res.status(200).send(transaction);
    } catch (err) {
        console.log("Error creating transaction", err.message);
        // Helpful error message for duplicates or missing fields
        res.status(500).send({ message: "Error creating transaction", error: err.message });
    }
};