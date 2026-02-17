import './Transactions.css'
import React, { useState, useEffect } from 'react';
import { readTransactions } from '../../pages/api/api.js';
import Spinner from '../loading-spinner/spinner.jsx';
import { IsLoggedIn } from '../context/context.jsx';

function Transactions({type, amount}) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const data = await readTransactions(parseInt(amount));
                // Sort by date descending (newest first)
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
    }, []);

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
            {IsLoggedIn() ? <div className={type}>
                {transactions.map((transaction, index) => (
                    <div key={transaction.transaction_id || index} className="transaction-item">
                        <div className="transaction-header">
                            <span className="transaction-name">{transaction.merchantName}</span>
                            <span className={`transaction-amount ${transaction.amount > 0 ? 'expense' : 'income'}`}>
                                ${Math.abs(transaction.amount).toFixed(2)}
                            </span>
                        </div>
                        <div className="transaction-details">
                            <div className="transaction-date"> { transaction.date.substring(0,10)} </div>
                            <span className="transaction-category">
                                {transaction.personal_finance_category ? transaction.personal_finance_category.join(', ') : 'Uncategorized'}
                            </span>
                        </div>
                    </div>
                ))}
            </div> : <div></div>}
        </>
    )
}

export default Transactions;
