import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import './PlaidLinkButton.css';

function PlaidLinkButton() {
  return (
    <button 
        id="link-button"
    >
      Link Account
    </button>
  );
}

export default PlaidLinkButton;