// array of navbar items
import './Navbar.css';
import { Link } from 'react-router-dom'; // handles link clicks

function Navbar() { 
    const logo = <img className="logo" src={require('../../assets/blackname.png')} alt='logo'/>
    const navbarItems = [
        { title: logo, path:"/", id: 0 },
        // { title: 'Home', path: "/", id: 1 },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
        { title: 'About', path: "/about", id: 2 },
        { title: 'Explore', path: "/", id: 3 },
        { title: 'Login', path: "/login", id: 4 },
    ];
    
    
    // wrap items in <Link> component instead of <button> for automatic react-router page linking
    const listItems = navbarItems.map(
        (item) => <Link to={item.path}> <li key={item.id} className="navbar-li"> {item.title} </li> </Link>
    );
    
    return (
        <ul className="navbar-ul">{listItems}</ul>
    );
}

export default Navbar;