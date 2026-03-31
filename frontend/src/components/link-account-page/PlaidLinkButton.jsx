import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { syncBanks, syncAccounts, createLinkToken } from '../../pages/api/api.js';
import './PlaidLinkButton.css';

function PlaidLinkButton({ onLinked }) {
  const [token, setToken] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const data = await createLinkToken();
        setToken(data.link_token);
      } catch (err) {
        console.error("Error creating link token:", err);
      }
    };

    fetchLinkToken();
  }, []);

  const onSuccess = useCallback(async (publicToken, metadata) => {
    try {
      const syncData = await syncBanks(publicToken, metadata);

      if (!syncData.plaidItem) {
        throw new Error('Failed to exchange token');
      }

      setIsSyncing(true);
      const plaidItemId = syncData.plaidItem._id;
      const syncResult = await syncAccounts(plaidItemId);
      
      if (syncResult.success && syncResult.inserted > 0) {
        alert(`Bank connected! ${syncResult.inserted} accounts imported.`);
      } else {
        alert("Bank connected! Your transactions will appear shortly.");
      }
      
      if (onLinked) {
        onLinked();
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  }, [onLinked]);

  const { open, ready } = usePlaidLink({
    token: token,
    onSuccess,
  });

  return (
    <button 
        id="link-button"
        onClick={() => open()}
        disabled={!ready || isSyncing}
    >
      {isSyncing ? 'Syncing...' : 'Link Account'}
    </button>
  );
}

export default PlaidLinkButton;