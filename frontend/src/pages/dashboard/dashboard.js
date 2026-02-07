import './dashboard.css';
import { Outlet, useNavigate } from 'react-router-dom';
import Dashbar from '../../components/dashbar/Dashbar.js'
import '../../components/cards/dash-component.css'
import LinkAccount from '../../components/link-account-page/LinkAccount.js';
import {useState} from 'react';
// import plaidLinked from '../../components/link-account-page/Authentication.js'

function Dashboard() {
    const navigate = useNavigate();
    const logo = require('../../assets/whitename.png');

    const [plaidLinked, plaidLinkedState] = useState(false);
    const linked = () => {
        return  (plaidLinked ? <Outlet/> : <LinkAccount/>);
    };
    
    
    return (
        <div>
            {/* the navbar at the top */}
            <header className="bar">
                <img className="dashboard-logo" src={logo} onClick={() => {navigate('/')}}></img>
            </header>

            {/* PAGE UNDER THE NAVBAR */}
            <div className="dashboard-container">
                <section className="dashboard">
                    <div className="dashboard-viewport">
                        {/*  DASHBAR TAKES UP LEFT SIDE  */}
                         <Dashbar/>
                        {/* this is for the routes (DARKEST RECTANGLE | Viewport For Virtual DOM) */}
                        <section className="sections-container">
                            {linked()}
                        </section>
                        <section>
                            {/* Sidebar */}
                        </section>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Dashboard;