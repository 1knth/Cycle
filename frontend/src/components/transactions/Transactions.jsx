import './Transactions.css'
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { readTransactions } from '../../pages/api/api.js';
import Spinner from '../loading-spinner/spinner.jsx';

function Transactions({type, amount}) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const accountId = searchParams.get('account');
    
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const response = await readTransactions(
                    parseInt(amount), 
                    accountId === 'all' ? null : accountId
                );
                const data = response.data || [];
                data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setTransactions(data);
            } catch (err) {
                console.error('Error fetching transactions:', err);
                setError('Failed to load transactions');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [accountId]);

    if (loading) {
        return (
            <Spinner/>
        );
    }

    if (error) {
        return (
            <div style={{ color: 'red' }}>{error}</div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div>No transactions found. Link your bank account to see transactions.</div>
        );
    }

    return (
        <>
            {!!localStorage.getItem('token') ? <div className={type}>
                {transactions.map((transaction, index) => (
                    <div key={transaction.plaidTransactionId || index} className="transaction-item">
                        <div className="transaction-header">
                            <span className="transaction-name">{transaction.name || transaction.merchantName || transaction.categoryId?.replace(/_/g, ' ').toLowerCase() || 'Unknown'}</span>
                            <span className={`transaction-amount ${transaction.amount > 0 ? 'expense' : 'income'}`}>
                                ${Math.abs(transaction.amount).toFixed(2)}
                            </span>
                        </div>
                        <div className="transaction-details">
                            <div className="transaction-date"> { transaction.date.substring(0,10)} </div>
                            <span className="transaction-category">
                                {transaction.categoryId || 'Uncategorized'}
                            </span>
                        </div>
                    </div>
                ))}
            </div> : <div></div>}
        </>
    )
}

export default Transactions;
