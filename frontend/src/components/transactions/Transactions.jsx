import './Transactions.css'
import React, { useState, useEffect } from 'react';
import { getTransactions } from '../../pages/api/api.js';
import Spinner from '../loading-spinner/spinner.jsx';

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const data = await getTransactions();
                // Plaid returns transactions in data.added array
                const transactionList = data.added || [];
                // Sort by date descending (newest first)
                transactionList.sort((a, b) => new Date(b.date) - new Date(a.date));
                setTransactions(transactionList);
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
            <section className="transactions-container">
                <Spinner/>
            </section>
        );
    }

    if (error) {
        return (
            <section className="transactions-container">
                <div style={{ color: 'red' }}>{error}</div>
            </section>
        );
    }

    if (transactions.length === 0) {
        return (
            <section className="transactions-container">
                <div>No transactions found. Link your bank account to see transactions.</div>
            </section>
        );
    }

    return (
        <section className="transactions-container">
            <h2>Transaction History</h2>
            <div className="transactions-list">
                {transactions.map((transaction, index) => (
                    <div key={transaction.transaction_id || index} className="transaction-item">
                        <div className="transaction-header">
                            <span className="transaction-name">{transaction.name}</span>
                            <span className={`transaction-amount ${transaction.amount > 0 ? 'expense' : 'income'}`}>
                                ${Math.abs(transaction.amount).toFixed(2)}
                            </span>
                        </div>
                        <div className="transaction-details">
                            <div className="transaction-date">{transaction.date}</div>
                            <span className="transaction-category">
                                {transaction.category ? transaction.category.join(', ') : 'Uncategorized'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Transactions;
