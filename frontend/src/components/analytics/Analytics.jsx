import './Analytics.css'
import OverviewBar from '../OverviewBar/OverviewBar.jsx';
import {useOutletContext} from 'react-router-dom';
import NumberCard from '../cards/NumberCard.jsx';

function Analytics() {
  const {user, accounts} = useOutletContext();
  return (
    <section className='overview-container'>
      <OverviewBar 
        username={user.username} 
        accounts={accounts}
      />
      <div className="cards">
        <NumberCard 
          type="regular"
          name="Balance"
          data={23}
          kpi="Available"
        />
      </div>
      <div className="cards">
        <NumberCard 
          type="regular"
        />
      </div>
      <div className="cards">
        <NumberCard 
          type="regular"
        />
      </div>
    </section>
  )
}

export default Analytics;
