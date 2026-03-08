import 'dotenv/config';
import mongoose from 'mongoose';
import {Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import {PlaidItem} from '../models/plaid-item.model.js';
import {Account} from '../models/account.model.js';
import {Transaction} from '../models/transaction.model.js';

// init plaidclient
export const plaidClient = new PlaidApi(new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
        },
    },
}));


// Link Token

export const createLinkToken = async (id) => {
  try {

    const request = {
      user: { client_user_id: id },
      client_name: 'Cycle',
      products: ['transactions'],
      country_codes: ['US', 'CA'],
      language: 'en',
    };

    const createTokenResponse = await plaidClient.linkTokenCreate(request);
    return (createTokenResponse.data);
  } catch (error) {
    console.error('Plaid Link Token Error:', error);
    return;
  }
};

// item syncing

export const syncPlaidItems = async (id, token) => {
  try {
    
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: token,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    let institutionName = 'Unknown Bank';
    let institutionId = null;
    try {
      const itemResponse = await plaidClient.itemGet({
        access_token: accessToken
      });
      const itemData = itemResponse.data
      institutionId = itemData.item.institution_id;
      
      if (institutionId) {
        const instResponse = await plaidClient.institutionsGetById({
          institution_id: institutionId,
          country_codes: ['US', 'CA']
        });
        const instData = instResponse.data;
        institutionName = instData.institution.name || "Unknown";
      }
    } catch (error) {
      console.log('Could not fetch institution name:', error);
    }

    const plaidItem = new PlaidItem({
      user: id,
      plaidAccessToken: accessToken,
      plaidItemId: itemId,
      institutionName: institutionName,
      institutionId: institutionId,
      plaidCursor: null,
      lastSync: null,
      status: 'active'
    });
    await plaidItem.save();


    return {
      plaidItem: {
        _id: plaidItem._id,
        plaidItemID: plaidItem.plaidItemId,
        institutionName: plaidItem.institutionName
      }
    }
  } catch (error) {
    console.error("Plaid Exchange Error");
    return {error};
  }
};

export const syncAccounts = async (itemId, userId) => {
  try {

    // plaid Item refers to the Bank
    // items are the accounts associated with the bank
    const plaidItem = await PlaidItem.findById(itemId);
    const getItems = await plaidClient.accountsGet({
      access_token: plaidItem.plaidAccessToken
    });
    const items = getItems.data;

    let savedItem = {}
    const savedItems = [];
    for (const account of items.accounts) {
      savedItem = new Account({
        plaidItemId: new mongoose.Types.ObjectId(itemId),
        userId: userId,
        accountId: account.account_id,
        institution: {
          name: plaidItem.institutionName || "Unknown",
          id: plaidItem.institutionId,
        },
        name: account.name,
        mask: account.mask,
        type: account.type,
        subtype: account.subtype,
        currency: account.balances.iso_currency_code,
        balances: {
          currentBalance: account.balances.current,
          availableBalance: account.balances.available,
        },
      });
      await savedItem.save();
      savedItems.push(savedItem);
      console.log("saved:", savedItem);
    }
    return savedItems;

  } catch (error) {
    console.error("savePlaidItems error");
    return {error};
  }
}

export const syncTransactions = async (accountId, userId) => {
  try {
    const account = await Account.findById(accountId);
    const plaidItem = await PlaidItem.findById(account.plaidItemId);
    const response = await plaidClient.transactionsSync({access_token: plaidItem.plaidAccessToken});
    const transactionsList = response.data.added;
    const savedTransactions = [];
    for (const t of transactionsList) {
      const transaction = new Transaction({
        userId,
        accountId: account.accountId,
        plaidItemId: account.plaidItemId,
        plaidTransactionId: t.transaction_id,
        amount: t.amount,
        date: t.date,
        merchantName: t.merchant_name,
        category_id: t.personal_finance_category?.primary || "Uncategorized",
        pending: t.pending,
      })
      await Transaction.findOneAndUpdate({ plaidTransactionId: t.transaction_id }, transactionData, { upsert: true, new: true });
      savedTransactions.push(transaction);
    }
    return({savedTransactions});
  } catch (error) {
    console.error("syncTransactions error");
    return {error};
  }
};