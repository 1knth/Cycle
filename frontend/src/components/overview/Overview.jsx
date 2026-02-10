import '../../components/overview/dash-component.css';
import NumberCard from "../cards/NumberCard.jsx"
import React, {useState, useEffect} from 'react';
import { getTransactions } from '../../pages/api/api.js';
import Spinner from '../loading-spinner/spinner.jsx';
import Transactions from '../transactions/Transactions.jsx';

function Overview() {
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

    // Calculate metrics from transactions
    const calculateMetrics = () => {
        if (!transactions.length) {
            return {
                totalSpend: 0,
                monthlySpend: 0,
                transactionCount: 0,
                averageTransaction: 0
            };
        }

        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

        const totalSpend = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
        const monthlyTransactions = transactions.filter(t => new Date(t.date) >= oneMonthAgo);
        const monthlySpend = monthlyTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);

        return {
            totalSpend: totalSpend.toFixed(2),
            monthlySpend: monthlySpend.toFixed(2),
            transactionCount: transactions.length,
            averageTransaction: (totalSpend / transactions.length).toFixed(2)
        };
    };

    const metrics = calculateMetrics();

    if (loading) {
        return (
            <Spinner/>
        );
    }


    if (error) {
        return (
            <section className="dash-component-container">
                <div className="cards-container">
                    <div style={{color: 'red'}}>{error}</div>
                </div>
            </section>
        );
    }

    return (
        <>
        <section className="dash-component-container">
            <span><h1>Overview</h1></span>
            <div className="cards-container">
                <NumberCard
                    type="regular"
                    name="Total Transactions"
                    data={metrics.transactionCount.toString()}
                    kpi="All time"
                />
                <NumberCard
                    type="regular"
                    name="Monthly Spend"
                    data={`$${metrics.monthlySpend}`}
                    kpi="Last 30 days"
                />
                <NumberCard
                    type="regular"
                    name="Total Spend"
                    data={`$${metrics.totalSpend}`}
                    kpi="All time"
                />
            </div>
            <div className="cards-container-2">
                <NumberCard
                    type="regular"
                    name="Avg Transaction"
                    data={`$${metrics.averageTransaction}`}
                />
            </div>
        </section>
        <section className="transactions-overview-container">
            {/* <NumberCard
                type="list"
                name="Recent Transactions"
                data={transactions.slice(0, 5).map(t =>
                    `${t.name}: $${Math.abs(t.amount).toFixed(2)}`
                ).join('\n')}
            /> */}
            <Transactions/>
        </section>
        </>
    )
}

export default Overview;
