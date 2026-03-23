import {useState} from 'react';
import AccountSelector from '../account-selector/Account-Selector.jsx';
import refresh from '../../assets/refresh.svg';
import {syncAllBanks,calculateMetrics} from '../../pages/api/api.js';

export default function OverviewBar({username}) {
    const [timeRange, setTimeRange] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [account, selectedAccount] = useState(null);
    
    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
    };
    
    const handleRefresh = async () => {
        try {
            const metricsData = await calculateMetrics(selectedAccount.id, timeRange);
            setMetrics(metricsData);

        } catch (err) {
            console.error('Error refreshing:', err);
        }
    };


    return (
        <div className="filter-bar">
            <div className="welcome-text">
                <p>Welcome,</p>
                <p>{username?.charAt(0).toUpperCase() + username?.slice(1) || "User"}</p>
            </div>
            <div className="filter-buttons">
                {/* Account Selector */}
                <AccountSelector/>
                
                <div style={{margin:'0.3rem', width: '0.2rem',height: '2rem', background: 'black', opacity: '10%', borderRadius:'3rem'}}></div>
                {/* Time Range Filters */}
                <button 
                    className={timeRange === '1W' ? 'active' : ''}
                    onClick={() => handleTimeRangeChange('1W')}
                >
                    <h6>1W</h6>
                </button>
                <button 
                    className={timeRange === '1M' ? 'active' : ''}
                    onClick={() => handleTimeRangeChange('1M')}
                >
                    <h6>1M</h6>
                </button>
                <button 
                    className={timeRange === '1Y' ? 'active' : ''}
                    onClick={() => handleTimeRangeChange('1Y')}
                >
                    <h6>1Y</h6>
                </button>
                <button 
                    className={timeRange === 'ALL' ? 'active' : ''}
                    onClick={() => handleTimeRangeChange('ALL')}
                >
                    <h6>ALL</h6>
                </button>
                <div style={{margin:'0.3rem', width: '0.2rem',height: '2rem', background: 'black', opacity: '10%', borderRadius:'3rem'}}></div>
                <button className="refresh-btn" onClick={() => handleRefresh()}>
                    <img src={refresh} style={{width: '1.2rem', filter: 'invert(100%)'}}></img>
                </button>
            </div>
        </div>
    )
}