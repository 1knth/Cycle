// array of navbar items
import './Navbar.css';
import { Link } from 'react-router-dom'; // handles link clicks
import cycle from '../../assets/blackname.png';
// import context for single page landing


function Navbar() { 
    const logo = <img className="logo" src={cycle} alt='logo'/>
    const navbarItems = [
        { title: logo, path:"/", key: 0, },
        { title: 'About', key: 1 },
        { title: 'Pricing', key: 2 },
        { title: 'Login', path: "/login", key: 3 },
    ];
    
    
    // wrap items in <Link> component instead of <button> for automatic react-router page linking
    const listItems = navbarItems.map(
        (item) => <Link to={item.path}> <li key={item.key} className="navbar-li"> {item.title} </li> </Link>
    );
    
    return (
        <ul className="navbar-ul">{listItems}</ul>
    );
}

export default Navbar;