import { useSearchParams } from 'react-router-dom';
import AccountSelector from '../account-selector/Account-Selector.jsx';
import refresh from '../../assets/refresh.svg';

export default function OverviewBar({ username, accounts }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const timeRange = searchParams.get('range') || 'ALL';
    
    const handleTimeRangeChange = (range) => {
        setSearchParams(prev => {
            prev.set('range', range);
            return prev;
        });
    };

    return (
        <div className="filter-bar">
            <div className="welcome-text">
                <p>Welcome,</p>
                <p>{username?.charAt(0).toUpperCase() + username?.slice(1) || "User"}</p>
            </div>
            <div className="filter-buttons">
                <AccountSelector accounts={accounts} />
                
                <div style={{margin:'0.3rem', width: '0.2rem',height: '2rem', background: 'black', opacity: '10%', borderRadius:'3rem'}}></div>
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
            </div>
        </div>
    )
}
