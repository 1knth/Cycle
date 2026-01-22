import './Dashbar.css';
import { NavLink } from 'react-router-dom'; // handles link clicks
import overviewlogo from '../../assets/overviewlogo.png'

function Dashbar() {
    const dashbarItems = [
        {title: "Overview", path:"overview", id:5, picture: overviewlogo}, 
        {title: "Analytics", path:"analytics", id:6}, 
        {title: "Transactions", path:"transactions", id:7}, 
        {title: "Settings", path:"settings", id:8}, 
    ]

    const listItems = dashbarItems.map(
        (item) => (
            <NavLink to={item.path} className={({isActive}) => isActive ? "dashbar-li-active" : "dashbar-li"}>
                <li key={item.id}>{item.title}</li>
            </NavLink>
        )
    )
    // const button = () => {
    //     let location = useLocation();
    //     const navigate = useNavigate();
    //     switch (location.pathname) {
    //         case "overview": 
    //             return (
    //                 <div> 
                        
    //                 </div>
    //             )
    //     }

    //     navigate('/dashboard/overview')
    // }

    return (
        <div className="dashbar-container">
            <ul className="dashbar-ul">{listItems}</ul>
        </div>
    )
}

export default Dashbar;