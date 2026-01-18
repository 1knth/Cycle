import './dashboard.css';
import { Outlet, useNavigate } from 'react-router-dom';
import Dashbar from '../../components/dashbar/Dashbar.js'

function Dashboard() {
    const navigate = useNavigate();
    const goHome = () => {
        navigate('/')
    }
    
    const logo = require('../../assets/whitename.png')
    return (
        <div>
            {/* the navbar at the top */}
            <header className="bar">
                <img className="dashboard-logo" src={logo} onClick={goHome}></img>
            </header>

            {/* PAGE UNDER THE NAVBAR */}
            <div className="dashboard-container">
                <section className="dashboard">
                    <div className="dashboard-viewport">
                        {/*  DASHBAR TAKES UP LEFT SIDE  */}
                        <div className="dashbar-container">
                            <Dashbar/>
                        </div>
                        {/* this is for the routes (DARKEST RECTANGLE | Viewport For Virtual DOM) */}
                        <section className="sections-container">
                            <Outlet/>
                        </section>
                    
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Dashboard;