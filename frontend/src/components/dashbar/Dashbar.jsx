import React from 'react';
import { useNavigate } from "react-router-dom";
import {IsLoggedIn} from '../context/context.jsx'
import './Dashbar.css'
import { NavLink } from 'react-router-dom'; // handles link clicks
import overviewlogo from '../../assets/overviewlogo.png'
import {getUser} from '../../pages/api/api.js'
import {useState, useEffect} from 'react';

function Dashbar () {
    const navigate = useNavigate();
    const [bankLinked, setBankLinked] = useState(null); 
    const logo = require('../../assets/blackname.png');
    useEffect(() => {
        const auth = async () => {
            const user = await getUser();
            setBankLinked(user.hasBankLinked);
            console.log(bankLinked);
        }
    },[setBankLinked])
    
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
                IsLoggedIn() ? (   
                <div className="dashbar-container">
                    <ul className="dashbar-ul">{listItems}</ul>
                </div>
                ) : (<div></div>)
            }
            <div className="user-info">
                { IsLoggedIn() ?
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