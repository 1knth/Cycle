import './dashboard.css';
import { Outlet, useNavigate } from 'react-router-dom';
import LinkAccount from '../../components/link-account-page/LinkBank.jsx';
import {IsLoggedIn, AccountProvider} from '../../components/context/context.jsx'
import {DashboardProvider} from '../../components/context/dashboard-context.jsx'
import {useState, useEffect} from 'react';
import Dashbar from '../../components/dashbar/Dashbar.jsx';
import { getUser } from '../api/api.js';

function Dashboard() {
    const navigate = useNavigate();
    const [plaidLinked, setPlaidLinked] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!IsLoggedIn()) {
            navigate('/login');
            return;
        }

        // Fetch fresh user status from API
        const checkUserStatus = async () => {
            try {
                setLoading(true);
                const user = await getUser();
                const hasBankLinked = user.hasBankLinked || false;
                setPlaidLinked(hasBankLinked);
                if (hasBankLinked) {
                    navigate('/dashboard/overview');
                }
            } catch (err) {
                console.error('Error fetching user status:', err);
            } finally {
                setLoading(false);
            }
        };

        checkUserStatus();
    }, []);

    const handleLinked = () => {
        setPlaidLinked(true);
        navigate('/dashboard/overview')
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="dashboard-container">
                <section className="dashboard">
                    <Dashbar/>
                    <div className="dashboard-viewport">
                        <section className="sections-container">
                            {plaidLinked ? (
                                <DashboardProvider>
                                    <AccountProvider>
                                        <Outlet/>
                                    </AccountProvider>
                                </DashboardProvider>
                            ) : (
                                <LinkAccount onLinked={handleLinked}/>
                            )} 
                        </section>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Dashboard;