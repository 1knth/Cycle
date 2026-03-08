import {syncPlaidItems} from '../services/.service.js';

export const syncBanks = async (req, res) => {
  try {
    const plaidItems = req.body.plaidItems;
    const response = await syncPlaidItems(plaidItems);
    const data = response.data;
    res.json(data);
  } catch (error) {
    res.error(`Error syncing banks ${error}`);
  }
}
