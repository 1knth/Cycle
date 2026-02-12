import './dashboard.css';
import { Outlet, useNavigate } from 'react-router-dom';
import LinkAccount from '../../components/link-account-page/LinkBank.jsx';
import {IsLoggedIn} from '../../components/context/context.jsx'
import {useState, useEffect} from 'react';
import Dashbar from '../../components/dashbar/Dashbar.jsx';

function Dashboard() {
    const navigate = useNavigate();
    useEffect(() => {
        if (!IsLoggedIn()) {
            navigate('/login')
        }
        if (plaidLinked) {
            navigate('/dashboard/overview');
        }
    }, [])
    
    // Check localStorage immediately for plaid status (set on login)
    const [plaidLinked, setPlaidLinked] = useState(() => {
        return localStorage.getItem("hasBankLinked") === "true";
    });

    const handleLinked = () => {
        setPlaidLinked(true);
        localStorage.setItem("hasBankLinked", "true");
    };

    return (
        <div>
            <div className="dashboard-container">
                <section className="dashboard">
                    <Dashbar/>
                    <div className="dashboard-viewport">
                        {/* this is for the routes (DARKEST RECTANGLE | Viewport For Virtual DOM) */}
                        <section className="sections-container">
                            {plaidLinked ? <Outlet/> : <LinkAccount onLinked={handleLinked}/>} 
                        </section>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Dashboard;