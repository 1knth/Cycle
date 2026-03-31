import 'dotenv/config';
import mongoose from 'mongoose';
import {Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import PlaidItem from '../models/plaid-item.model.js';
import Account from '../models/account.model.js';
import Transaction from '../models/transaction.model.js';

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
    return {success: false, error: error.message};
  }
};

// item syncing

export const syncPlaidItems = async (id, token) => {
  try {
    
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: token,
    });
    if (!response || !response.data) {
      return {success: false, error: "cant exchange public token"};
    }
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
      success: true,
      plaidItem: {
        _id: plaidItem._id,
        plaidItemID: plaidItem.plaidItemId,
        institutionName: plaidItem.institutionName
      }
    }
  } catch (error) {
    console.error("Plaid Exchange Error: ", error);
    return {success: false, error: error.message};
  }
};

export const syncAccounts = async (itemId, userId) => {
  try {

    // plaid Item refers to the Bank
    // items are the accounts associated with the bank
    const plaidItem = await PlaidItem.findById(itemId);
    if (!plaidItem) {
      return {success: false, error: "plaidItem from ID not found"};
    }

    const response = await plaidClient.accountsGet({
      access_token: plaidItem.plaidAccessToken
    });
    const accounts = response.data.accounts;
    
    // bulkwrite implementation
    // create object for bulkWrite
    const bulkOps = accounts.map(account => ({
      updateOne: {
        filter: {
          accountId: account.account_id
        },
        update: {
          $set: {
            plaidItemId: new mongoose.Types.ObjectId(itemId),
            userId,
            accountId: account.account_id,
            institution: {
              name: plaidItem.institutionName,
              id: plaidItem.institutionId
            },
            name: account.name,
            mask: account.mask,
            type: account.type,
            subtype: account.subtype,
            currency: account.balances.iso_currency_code,
            balances: {
              currentBalance: account.balances.current,
              availableBalance: account.balances.available,
              limit: account.balances.limit
            },
          },
        },
        upsert: true
      }
    }));
    const savedAccounts = await Account.bulkWrite(
      bulkOps, 
      {ordered: false}
    );
    return {
      success: true,
      inserted: savedAccounts.upsertedCount,
      updated: savedAccounts.modifiedCount
    };

    // set implementation
    // // array of duplicated accounts stored in an object
    // const duplicateAccounts = await Account.find({accountId: { $in: accountIds}});
    // // loop through the duplicate accounts and create a SET containing the ids
    // const duplicateIds = new Set(duplicateAccounts.map(account => account.accountId));
    // const newAccounts = accounts
    //   .filter(account => !duplicateIds.has(account.account_id))
    //   .map(account => ({
    //     plaidItemId: new mongoose.Types.ObjectId(itemId),
    //     userId,
    //     accountId: account.account_id,
    //     institution: {
    //       name: plaidItem.institutionName,
    //       id: plaidItem.institutionId
    //     },
    //     name: account.name,
    //     mask: account.mask,
    //     type: account.type,
    //     subtype: account.subtype,
    //     currency: account.balances.iso_currency_code,
    //     balances: {
    //       currentBalance: account.balances.current,
    //       availableBalance: account.balances.available,
    //       limit: account.balances.limit
    //     },
    //   }));
    // if (newAccounts.length > 0) {
    //   await Account.insertMany(newAccounts,{ordered:false});
    // }
    // return {
    //   inserted: newAccounts.length, 
    //   skipped: duplicateIds.size
    // }

    // let savedItem = {}
    // const savedItems = [];
    // for (const account of items.accounts) {
    //   savedItem = new Account({
    //     plaidItemId: new mongoose.Types.ObjectId(itemId),
    //     userId: userId,
    //     accountId: account.account_id,
    //     institution: {
    //       name: plaidItem.institutionName || "Unknown",
    //       id: plaidItem.institutionId,
    //     },
    //     name: account.name,
    //     mask: account.mask,
    //     type: account.type,
    //     subtype: account.subtype,
    //     currency: account.balances.iso_currency_code,
    //     balances: {
    //       currentBalance: account.balances.current,
    //       availableBalance: account.balances.available,
    //     },
    //   });
    //   await savedItem.save();
    //   savedItems.push(savedItem);
    //   console.log("saved:", savedItem);
    // }
    // return savedItems;

  } catch (error) {
    console.error("syncAccounts error: ", error);
    return {success: false, error: error.message};
  }
}

export const syncTransactions = async (accountId, userId) => {
  try {
    const account = await Account.findOne({accountId});
    if (!account) {
      return { success: false, error: "Account not found in database." };
    }
    
    const plaidItem = await PlaidItem.findById(account.plaidItemId);
    if (!plaidItem) {
      return { success: false, error: "Associated PlaidItem not found." };
    }
  
    let cursor = plaidItem.plaidCursor || undefined; 
    let hasMore = true;
    let totalUpserted = 0;
    let totalDeleted = 0;

    // Plaid requires a loop to fetch all pages of transactions
    // individual api call returns less than 500 txn
    // the response (txn obj) has a boolean property indicating whether (txn obj) contains > 500 txn 
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: plaidItem.plaidAccessToken,
        cursor: cursor
      });

      const added = response.data.added;
      const modified = response.data.modified;
      const removed = response.data.removed;

      const addedOps = added.map(t => ({
        updateOne: {
          filter: { plaidTransactionId: t.transaction_id },
          update: {
            $set: {
              userId,
              accountId: t.account_id,
              plaidItemId: account.plaidItemId,
              amount: t.amount,
              date: t.date,
              name: t.name || t.merchant_name || null,
              merchantName: t.merchant_name,
              categoryId: t.personal_finance_category?.primary || "Uncategorized",
              pending: t.pending,
            }
          },
          upsert: true
        },
      }));

      const modifiedOps = modified.map(t => ({
        updateOne: {
          filter: { plaidTransactionId: t.transaction_id }, 
          update: {
            $set: {
              amount: t.amount,
              date: t.date,
              name: t.name || t.merchant_name || null,
              merchantName: t.merchant_name,
              categoryId: t.personal_finance_category?.primary || "Uncategorized",
              pending: t.pending,
            }
          },
          upsert: false 
        },
      }));

      const removedOps = removed.map(t => ({
        deleteOne: {
          filter: { plaidTransactionId: t.transaction_id }
        }
      }));

      const bulkOps = [...addedOps, ...modifiedOps, ...removedOps];

      if (bulkOps.length > 0) {
        const bulkResult = await Transaction.bulkWrite(bulkOps, { ordered: false });
        totalUpserted += (bulkResult.upsertedCount + bulkResult.modifiedCount);
        totalDeleted += bulkResult.deletedCount;
      }

      cursor = response.data.next_cursor;
      hasMore = response.data.has_more;
    }

    plaidItem.plaidCursor = cursor;
    await plaidItem.save();

    return { 
      success: true, 
      totalUpserted,
      totalDeleted
    };

  } catch (error) {
    console.error("syncTransactions error: ", error);
    // 2. Consistent return signature for the catch block
    return { 
      success: false, 
      error: error.response?.data?.error_message || error.message 
    };
  }
};
