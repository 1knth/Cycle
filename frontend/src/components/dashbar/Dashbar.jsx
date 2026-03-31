import React from 'react';
import { useNavigate } from "react-router-dom";
import './Dashbar.css'
import { NavLink } from 'react-router-dom'; // handles link clicks
import overviewlogo from '../../assets/overviewlogo.png'

function Dashbar ({ user }) {
    const navigate = useNavigate();
    const logo = require('../../assets/blackname.png');
    
    const dashbarItems = [
        {title: "Overview", path:"overview", key:5, picture: overviewlogo}, 
        {title: "Analytics", path:"analytics", key:6}, 
        {title: "Transactions", path:"transactions", key:7}, 
        {title: "Settings", path:"settings", key:8}, 
    ]

    const listItems = dashbarItems.map(
        (item) => (
            <NavLink to={item.path} className={({isActive}) => isActive ? "dashbar-li-active" : "dashbar-li"}>
                <li key={item.key}>{item.title}</li>
            </NavLink>
        )
    )
    
    
    
    return (
        <nav className="bar">
            <div className='logo-container'>
                <img className="dashboard-logo" src={logo} onClick={() => {navigate('/')}}></img>
            </div>
            { 
                !!localStorage.getItem('token') ? (   
                <div className="dashbar-container">
                    <ul className="dashbar-ul">{listItems}</ul>
                </div>
                ) : (<div></div>)
            }
            <div className="user-info">
                { !!localStorage.getItem('token') ?
                    ( 
                        <>
                            <button onClick={() => {
                                localStorage.removeItem("token");
                                localStorage.removeItem("hasBankLinked");
                                localStorage.removeItem("user");
                                navigate('/login'); 
                            }}> Logout </button> 
                        </>
                    ) 
                    : 
                    ( <span></span> )
                }
            </div>
        </nav>
    )
}

export default Dashbar;
