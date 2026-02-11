import Transactions from '../../components/transactions/Transactions.jsx';
import './transactions-page.css';
import '../../components/overview/dash-component.css'; 
import SearchBar from '../../components/SearchBar/SearchBar.jsx';

function TransactionsPage() {
    const search = (e) => {
        e.preventDefault();
    }

    return (
        <section className='transactions-page-container'>
            <div className="transactions-container">
                <div className="transactions-bar">
                    <h1>Transactions</h1>
                    <SearchBar onSubmit={search}/>
                </div>
                <Transactions
                    type="transactions-list-vertical"
                />
            </div>
        </section>
    );

}

export default TransactionsPage;