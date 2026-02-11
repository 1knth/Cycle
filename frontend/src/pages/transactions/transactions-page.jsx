import Transactions from '../../components/transactions/Transactions.jsx';
import './transactions-page.css';
import '../../components/overview/dash-component.css'; 

function TransactionsPage() {
    const search = (e) => {
        e.preventDefault();
    }

    return (
        <section className='transactions-page-container'>
            <div className="transactions-container">
                <div className="transactions-bar">
                    <h1>Transactions</h1>
                    <div className="transaction-bar-buttons">
                        <input className="search" type="text" placeholder="Search transactions..." />
                        <button className="filter-button">Search</button>
                        <button className="filter-button">Filter</button>
                    </div>
                </div>
                <Transactions
                    type="transactions-list-vertical"
                />
            </div>
        </section>
    );

}

export default TransactionsPage;