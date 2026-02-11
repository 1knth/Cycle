import './dashboard.css';
import { Outlet, useNavigate } from 'react-router-dom';
import Dashbar from '../../components/dashbar/Dashbar.jsx'
import LinkAccount from '../../components/link-account-page/LinkBank.jsx';
import {useEffect, useState} from 'react';

function Dashboard() {
    const navigate = useNavigate();
    const logo = require('../../assets/blackname.png');
    // Check localStorage immediately for plaid status (set on login)
    const [plaidLinked, setPlaidLinked] = useState(() => {
        return localStorage.getItem("hasBankLinked") === "true";
    });

    const handleLinked = () => {
        setPlaidLinked(true);
        localStorage.setItem("hasBankLinked", "true");
    };

    const linked = () => {
        return plaidLinked ? <Outlet/> : <LinkAccount onLinked={handleLinked}/>;
    };

    return (
        <div>
            {/* the navbar at the top */}

            {/* PAGE UNDER THE NAVBAR */}
            
            <div className="dashboard-container">
                <section className="dashboard">
                    <nav className="bar">
                        <div className='logo-container'>
                            <img className="dashboard-logo" src={logo} onClick={() => {navigate('/')}}></img>   
                        </div>
                        <Dashbar/>
                        <div className="user-info">
                            <button onClick={() => {
                                localStorage.removeItem("token");
                                localStorage.removeItem("hasBankLinked");
                                localStorage.removeItem("user");
                                navigate('/login');
                            }}>Logout</button>
                        </div>
                    </nav>
                    <div className="dashboard-viewport">
                        {/* this is for the routes (DARKEST RECTANGLE | Viewport For Virtual DOM) */}
                        <section className="sections-container">
                            {linked()}
                        </section>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Dashboard;