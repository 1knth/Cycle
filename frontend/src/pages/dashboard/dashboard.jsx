import './dashboard.css';
import { Outlet, useNavigate } from 'react-router-dom';
import {useState, useEffect} from 'react';
import LinkAccount from '../../components/link-account-page/LinkBank.jsx';
import Dashbar from '../../components/dashbar/Dashbar.jsx';
import { getUser, getAccounts, syncTransactions } from '../api/api.js';

function Dashboard() {
  const navigate = useNavigate();
  const [plaidLinked, setPlaidLinked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    const initDashboard = async () => {
      try {
        setLoading(true);
        const userRes = await getUser();
        if (userRes.success) {
          setUser(userRes.data);
          const hasBankLinked = userRes.data.hasBankLinked || false;
          setPlaidLinked(hasBankLinked);
          
          if (hasBankLinked) {
            const response = await getAccounts();
            if (response.success) {
              setAccounts(response.data);
              await Promise.all(
                response.data.map(a => syncTransactions(a.accountId))
              );
            }
            setLoading(false);
            navigate('/dashboard/overview');
            return;
          }
        }
      } catch (err) {
        console.error('Error fetching user status:', err);
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, []);

  
  const handleLinked = async () => {
      setPlaidLinked(true);
      const response = await getAccounts();
      if (response.success) {
        setAccounts(response.data);
        await Promise.all(
          response.data.map(a => syncTransactions(a.accountId))
        );
      }
      navigate('/dashboard/overview')
  };

  if (loading) {
      return <div>Loading...</div>;
  }

  return (
      <div>
          <div className="dashboard-container">
              <section className="dashboard">
                  {plaidLinked ? <Dashbar user={user}/> : <></>}
                  <div className="dashboard-viewport">
                      <section className="sections-container">
                          {plaidLinked 
                            ?  <Outlet context={{accounts, user}}/>
                            :  <LinkAccount onLinked={handleLinked}/> } 
                      </section>
                  </div>
              </section>
          </div>
      </div>
  );
}

export default Dashboard;
