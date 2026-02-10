import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import './PlaidLinkButton.css';

function PlaidLinkButton({ onLinked }) {
  const [token, setToken] = useState(null);

  // initialize link token
  useEffect(() => {
    const createLinkToken = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5001/api/plaid/create-link-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setToken(data.link_token);
      } catch (err) {
        console.error("Error creating link token:", err);
      }
    };

    createLinkToken();
  }, []);

  // 2. Handle what happens after user connects a bank
  const onSuccess = useCallback(async (publicToken, metadata) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5001/api/plaid/exchange-public-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ public_token: publicToken, metadata }),
      });
      alert("Bank connected successfully!");
      if (onLinked) {
        onLinked();
      }
    } catch (err) {
      console.error("Error exchanging token:", err);
    }
  }, [onLinked]);

  // pass in link token
  // link bank account portal on click
  const { open, ready } = usePlaidLink({
    token: token,
    onSuccess,
  });

  return (
    <button 
        id="link-button"
        onClick={() => open()}
        disabled={!ready}
    >
      Link Account
    </button>
  );
}

export default PlaidLinkButton;