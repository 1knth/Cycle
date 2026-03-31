import '../../components/overview/Overview.css';
import Spinner from '../loading-spinner/spinner.jsx'
import { useState, useEffect } from 'react';
import {useOutletContext, useSearchParams} from 'react-router-dom'
import { calculateMetrics } from '../../pages/api/api.js';
import OverviewBar from '../OverviewBar/OverviewBar.jsx';
import NumberCard from "../cards/NumberCard.jsx"
import TransactionComponent from '../transactions/Transactions.jsx';
import Chart from '../charts/Charts.jsx';

function Overview() {
    const [metrics, setMetrics] = useState({});
    const [loading, setLoading] = useState(true);
    const [metricsError, setMetricsError] = useState(null);

    const { accounts, user } = useOutletContext();
    const username = user?.username || '';

    const [searchParams] = useSearchParams();
    const selectedAccount = searchParams.get('account') || 'all';
    const timeRange = searchParams.get('range') || 'ALL';

    // Fetch metrics when account or time range changes
    useEffect(() => {
        if (!selectedAccount || accounts.length === 0) return;
        
        const updateMetrics = async () => {
            try {
                setLoading(true);
                const accountIdForApi = selectedAccount === 'all' 
                ? null 
                : accounts?.find(a => a.accountId === selectedAccount)?.accountId || selectedAccount;

                const response = await calculateMetrics(accountIdForApi, timeRange);
                if (response.success) {
                  setMetrics(response.data);
                }
                setMetricsError(null);
            } catch (error) {
                console.error('Error fetching metrics:', error);
                setMetricsError('Failed to update metrics');
            } finally { setLoading(false); }
        };

        updateMetrics();
    }, [selectedAccount, timeRange, accounts]);

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

    if ( loading || username === "") {
        return <Spinner/>;
    }
    // return error page if error
    if (metricsError) {
        return (
            <section className="dash-component-container">
                <div className="cards-container">
                    <div style={{color: 'red', padding: '2rem'}}>
                        <h3>Error Loading Data</h3>
                        <p>{ metricsError}</p>
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
    if (accounts.length === 0) {
      return (
        <section className="dash-component-container">
          <div className="cards-container">
            <div style={{padding: '2rem', textAlign: 'center'}}>
              <h3>No Bank Accounts Linked</h3>
              <p>Please link a bank account to view your financial data.</p>
            </div>
          </div>
        </section>
      )
    }

    return (
        <>
            <section className="overview-container">
                <OverviewBar 
                    username={username}
                    accounts={accounts}
                />
                <div className="row-1">
                    <NumberCard
                        type="regular"
                        name="Balance"
                        data={`$${Intl.NumberFormat("en-US", {maximumFractionDigits: 2, minimumFractionDigits: 2}).format(metrics.balances?.availableBalance)}` || 0}
                        kpi="Available"
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
                                dataValues = {metrics.debits}
                                // dataValues = {[23,23,23,23,23]}
                            />
                        }
                        kpi={timeRange === 'ALL' ? `${12 || 0}%` : `${12 || 0}%`}
                        kpi2={timeRange === 'ALL' ? ' All time' : ` Last ${displayTimeRange()}`}
                    />
                {/*     <NumberCard */}
                {/*         type="graph" */}
                {/*         name="Spending Trend" */}
                {/*         data= */}
                {/*             { */}
                {/*                 <Chart */}
                {/*                     type="plot" */}
                {/*                     // dataValues = {metrics.delta.spending} */}
                {/*                     dataValues = {metrics.delta.spendingArray || [0,0,0,0,0]} */}
                {/*                     // dataValues = {[30,18,48,23,50]} */}
                {/*                 /> */}
                {/*             } */}
                {/*         kpi={timeRange === 'ALL' ? `${metrics.delta.spending || 0}%` : `${metrics.delta.spending || 0}%`} */}
                {/*         kpi2={timeRange === 'ALL' ? ' All time' : ` Last ${displayTimeRange()}`} */}
                {/*     /> */}
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
