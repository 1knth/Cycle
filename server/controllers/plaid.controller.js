import { 
    createLinkToken as createLinkTokenService,
    syncPlaidItems as syncPlaidItemsService,
    syncAccounts as syncAccountsService,
    syncTransactions as syncTransactionsService
} from "../services/plaid.service.js";



export const createLinkToken = async (req, res) => {
    try {
        const clientUserId = req.user._id.toString(); 
        const response = await createLinkTokenService(clientUserId);
        if (response.success === false) {
            return res.status(404).json({message: "error creating plaid token"});
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};


// save user banks to database

export const syncPlaidItems = async (req, res) => {
  try {
    const id = req.user._id;
    const token = req.body.public_token;

    if (!token || token === "") {
        return res.status(400).json( {message: "No public token found"} )
    } 
    const response = await syncPlaidItemsService(id, token);
    if (!response.success) {
      return res.status(404).json({message: "Error syncing plaid items"});
    }
    res.status(201).json(response);
  } catch (error) {
    console.error("Error syncing items: ", error);
    res.status(500).json({error: error.message});
  }
};


// save accounts associated to given bank to database
export const syncAccounts = async (req,res) => {
    try {
        const plaidItemId = req.params.plaidItemId;
        if (!plaidItemId) {
            return res.status(400).json({message: "cannot find plaidItemId"});
        }
        const response = await syncAccountsService(plaidItemId, req.user._id);
        res.status(201).json(response);
    } catch (error) {
        console.error("error syncing accounts items: ", error);
        res.status(500).json({error: error.message});
    }
};

export const syncTransactions = async (req, res) => {
    try {
        const accountId = req.params.accountId;
        if (!accountId) {
            return res.status(400).json({message: "No Account Selected"});
        }
        const response = await syncTransactionsService(accountId, req.user._id);
        if (!response.success) {
            return res.status(400).json({error: response.error});
        }
        res.status(201).json(response);
    } catch (error) {
        console.error("error syncing transactions: ", error);
        res.status(500).json({error: error.message});
    }
}

export const whTransactions = async (req, res) => {
    try {
        const {webhook_type, webhook_code, item_id} = req.body;
        res.status(200).json({});
        if (webhook_type === "TRANSACTIONS") {
            if (webhook_code === "SYNC_UPDATES_AVAILABLE") {
                console.log(`Transactions available for:${item_id}`);
            }
        }
    } catch (error) {
        console.error(`Webhook error: ${error}`);
        if (!res.headersSent) {
            res.status(500).json( {error: "Internal server error"});
        }
    }
}
