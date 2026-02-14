import '../../components/overview/dash-component.css';
import NumberCard from "../cards/NumberCard.jsx"
import { useState, useEffect } from 'react';
import Spinner from '../loading-spinner/spinner.jsx'
import { calculateMetrics, syncTransactions, getUser } from '../../pages/api/api.js';
import { useAccount } from '../../components/context/context.jsx';
import TransactionComponent from '../transactions/Transactions.jsx';
import AccountSelector from '../account-selector/Account-Selector.jsx';

function Overview() {
    const [metrics, setMetrics] = useState({});
    const { accounts, selectedAccount, loading: accountsLoading, error: accountsError } = useAccount();
    const [timeRange, setTimeRange] = useState('1M'); // Default to 1 month
    const [metricsLoading, setMetricsLoading] = useState(true);
    const [metricsError, setMetricsError] = useState(null);
    const [username, setUsername] = useState("");
    // Sync transactions and fetch user on load
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
            } finally {
                setMetricsLoading(false);
            }
        };

        updateMetrics();
    }, [selectedAccount, timeRange]);

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
    };

    // const handleRefresh = async () => {
    //     try {
    //         setLoading(true);
    //         await syncTransactions();
    //         // Refresh accounts in case new ones were added
    //         const accountsData = await getAccounts();
    //         setAccounts(accountsData.accounts || []);
    //         setGroupedAccounts(accountsData.groupedByInstitution || {});
    //         // Refresh metrics
    //         const metricsData = await calculateMetrics(selectedAccount?.id, timeRange);
    //         setMetrics(metricsData);
    //     } catch (err) {
    //         console.error('Error refreshing:', err);
    //         setError('Failed to refresh data');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

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
        return <div>Not logged in</div>;
    }

    if (accountsLoading || metrics.totalTxn === undefined || username === "") {
        return (
            <Spinner/>
        );
    }

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
        <section className="dash-component-container">
            <div className="filter-bar">
                <div className="welcome-text">
                    <p>Welcome,</p>
                    <p>{username?.charAt(0).toUpperCase() + username?.slice(1) || "User"}</p>
                </div>
                <div className="filter-buttons">
                    {/* Account Selector */}
                    <AccountSelector/>
                    
                    {/* Time Range Filters */}
                    <button 
                        className={timeRange === '1W' ? 'active' : ''}
                        onClick={() => handleTimeRangeChange('1W')}
                    >
                        1W
                    </button>
                    <button 
                        className={timeRange === '1M' ? 'active' : ''}
                        onClick={() => handleTimeRangeChange('1M')}
                    >
                        1M
                    </button>
                    <button 
                        className={timeRange === '1Y' ? 'active' : ''}
                        onClick={() => handleTimeRangeChange('1Y')}
                    >
                        1Y
                    </button>
                    <button 
                        className={timeRange === 'ALL' ? 'active' : ''}
                        onClick={() => handleTimeRangeChange('ALL')}
                    >
                        ALL
                    </button>
                    
                    <button className="refresh-btn">
                        Refresh
                    </button>
                </div>
            </div>
            
            <div className="cards-container">
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
            
            <div className="cards-container-2">
                <NumberCard
                    type="graph"
                    name="Portfolio"
                />
                <NumberCard
                    type="graph"
                    name="Spending Trend"
                    kpi="Analytics"
                />
            </div>
            
            <div className="card-container">
                <h1>Recent Transactions</h1>
                <TransactionComponent 
                    type="transactions-list-horizontal"
                />
            </div>
        </section>
        </>
    );
}

export default Overview;
