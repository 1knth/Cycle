import '../../components/overview/Overview.css';
import NumberCard from "../cards/NumberCard.jsx"
import { useState, useEffect } from 'react';
import Spinner from '../loading-spinner/spinner.jsx'
import { calculateMetrics, getUser } from '../../pages/api/api.js';
import { useAccount } from '../../components/context/context.jsx';
import TransactionComponent from '../transactions/Transactions.jsx';
import Chart from '../charts/Charts.jsx';
import OverviewBar from '../OverviewBar/OverviewBar.jsx';

function Overview() {
    const [metrics, setMetrics] = useState({});
    const {accounts, selectedAccount, loading: accountsLoading, error: accountsError } = useAccount();
    const [timeRange, setTimeRange] = useState('ALL'); // Default to 1 month
    const [username, setUsername] = useState("");
    const [metricsLoading, setMetricsLoading] = useState(true);
    const [metricsError, setMetricsError] = useState(null);
    

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const user = await getUser();
                setUsername(user.username)
                localStorage.setItem("user",user.username);
            } catch (syncErr) {
                console.log('Initial sync may have failed:', syncErr.message);
            }
        };

        loadInitialData();
    }, []);

    // Fetch metrics when account or time range changes
    useEffect(() => {
        if (!selectedAccount) return;
        
        const updateMetrics = async () => {
            try {
                setMetricsLoading(true);
                const metricsData = await calculateMetrics(selectedAccount.id, timeRange);
                setMetrics(metricsData);
                setMetricsError(null);
            } catch (err) {
                console.error('Error fetching metrics:', err);
                setMetricsError('Failed to update metrics');
            } finally { setMetricsLoading(false); }
        };

        updateMetrics();
    }, [selectedAccount, timeRange]);

    const displayTimeRange = () => {
        switch(timeRange) {
            case '1W':
                return "week"
            
            case '1M':
                return "month"
            
            case '1Y':
                return "year"
        }
    }

    if (localStorage.getItem('token') == null) {
        return <p>Not logged in</p>;
    }

    if (accountsLoading || metricsLoading || username === "") {
        return <Spinner/>;
    }
    // return error page if error
    if (accountsError || metricsError) {
        return (
            <section className="dash-component-container">
                <div className="cards-container">
                    <div style={{color: 'red', padding: '2rem'}}>
                        <h3>Error Loading Data</h3>
                        <p>{accountsError || metricsError}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            style={{marginTop: '1rem', padding: '0.5rem 1rem'}}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // Show message if no accounts linked
    if (accounts.length === 0 && !accountsLoading) {
        return (
            <section className="dash-component-container">
                <div className="cards-container">
                    <div style={{padding: '2rem', textAlign: 'center'}}>
                        <h3>No Bank Accounts Linked</h3>
                        <p>Please link a bank account to view your financial data.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="overview-container">
                <OverviewBar 
                    username={username}
                />
                <div className="row-1">
                    <NumberCard
                        type="regular"
                        name="Balance"
                        data={`$${Intl.NumberFormat("en-US", {maximumFractionDigits: 2, minimumFractionDigits: 2}).format(metrics.balance)}` || 0}
                        kpi="Current"
                    />
                    <NumberCard
                        type="regular"
                        name="Transactions"
                        data={`${metrics.totalTxn}` || 0}
                        kpi={timeRange === 'ALL' ? 'All time' : `Last ${displayTimeRange()}`}
                    />
                    <NumberCard
                        type="regular"
                        name="Total Spend"
                        data={`$${Intl.NumberFormat("en-US", {maximumFractionDigits: 2, minimumFractionDigits: 2}).format(metrics.totalSpend)}` || 0}
                        kpi={timeRange === 'ALL' ? 'All time' : `Last ${displayTimeRange()}`}
                    />
                    <NumberCard
                        type="regular"
                        name="Avg Transaction"
                        data={`$${Intl.NumberFormat("en-US", {maximumFractionDigits: 2, minimumFractionDigits: 2}).format(metrics.avgTxn)}` || 0}
                        kpi={timeRange === 'ALL' ? 'All time' : `Last ${displayTimeRange()}`}
                    />
                </div>
                
                <div className="row-2">
                    <NumberCard
                        type="graph"
                        name="Portfolio"
                        data={
                            <Chart
                                dataValues = {!(metrics.delta.portfolioArray[0] > 0) ? [0,0,0,0,0] : metrics.delta.portfolioArray || [0,0,0,0,0]}
                                // dataValues = {[23,23,23,23,23]}
                            />
                        }
                        kpi={timeRange === 'ALL' ? `${metrics.delta.portfolio || 0}%` : `${metrics.delta.portfolio || 0}%`}
                        kpi2={timeRange === 'ALL' ? ' All time' : ` Last ${displayTimeRange()}`}
                    />
                    <NumberCard
                        type="graph"
                        name="Spending Trend"
                        data=
                            {
                                <Chart
                                    type="plot"
                                    // dataValues = {metrics.delta.spending}
                                    dataValues = {metrics.delta.spendingArray || [0,0,0,0,0]}
                                    // dataValues = {[30,18,48,23,50]}
                                />
                            }
                        kpi={timeRange === 'ALL' ? `${metrics.delta.spending || 0}%` : `${metrics.delta.spending || 0}%`}
                        kpi2={timeRange === 'ALL' ? ' All time' : ` Last ${displayTimeRange()}`}
                    />
                </div>
                
                <div className="card-container">
                    <h1>Recent Transactions</h1>
                    <TransactionComponent 
                        type="transactions-list-horizontal"
                        amount="10"
                    />
                </div>
            </section>
        </>
    );
}

export default Overview;
