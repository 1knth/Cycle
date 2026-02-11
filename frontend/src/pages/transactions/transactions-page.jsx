import Transactions from '../../components/transactions/Transactions.jsx';
import './transactions-page.css';

function TransactionsPage() {
    return (
        <section className="transactions-container">
            <div className="transactions-bar">
                <h1>Transactions</h1>
                <input className="search" type="text" placeholder="Search transactions..." />
                <div>
                    <button className="filter-button">Filter</button>
                    <button className="filter-button">Search</button>
                </div>
            </div>
            <Transactions
                type="transactions-list-vertical"
            />
        </section>
    );

}

export default TransactionsPage;