import Transactions from '../../components/transactions/Transactions.jsx';
import './transactions-page.css';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import {useState, useEffect} from 'react';
import {readTransactions} from '../api/api.js';

function TransactionsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    // useEffect(() => {
        const handleSearch = async () => {
            if (!searchTerm) {
                    setResults([]);
                    return;
            }
            try {
                const transactions = await readTransactions();
                const filtered = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        // const delayDebounceFn = setTimeout(() => {
        //     handleSearch();
        // }, 300);
        // return () => clearTimeout(delayDebounceFn);
    // }, [searchTerm]);

    return (
        <section className='transactions-page-container'>
            <div className="transactions-container">
                <div className="transactions-bar">
                    <h1>Transactions</h1>
                    <SearchBar onSubmit={setSearchTerm}/>
                </div>
                <Transactions
                    type="transactions-list-vertical"
                    amount="all"
                />
            </div>
        </section>
    );

}

export default TransactionsPage;