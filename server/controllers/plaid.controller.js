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
        res.status(201).json(response);
    } catch (error) {
        res.status(501).json({message: "Error creating link token"})
    }
};


// save user banks to database

export const syncPlaidItems = async (req, res) => {
    try {
        const id = req.user._id;
        const token = req.body.public_token;

        if (!token || token === "") {
            res.status(501).json( {message: "No public token found"} )
            return;
        } 
        const response = await syncPlaidItemsService(id, token);
        res.status(201).json(response);
    } catch (error) {
        console.error("Error syncing items: ", error);
        res.status(501).json({error: error});
    }
};


// save accounts associated to given bank to database
export const syncAccounts = async (req,res) => {
    try {
        const plaidItemId = req.params.plaidItemId;
        if (!plaidItemId) {
            res.status(501).json({message: "cannot find plaidItemId"});
            return;
        }
        const response = await syncAccountsService(plaidItemId, req.user._id);
        res.status(201).json(response);
    } catch (error) {
        console.error("error syncing accounts items: ", error);
        res.status(501).json({error: error});
    }
};

export const syncTransactions = async (req, res) => {
    try {
        const accountId = req.params.accountId;
        if (!accountId) {
            res.status(501).json({message: "No Account Selected"})
            return;
        }
        const response = await syncTransactionsService(accountId, req.user._id);
        res.status(201).json(response);
    } catch (error) {
        console.error("error syncing transactions: ", error);
        res.status(501).json({error: error});
    }
}