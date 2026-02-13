import {useEffect, useState}from 'react';
import './SearchBar.css';
import {FaSearch} from 'react-icons/fa';
import {getTransactions} from '../../pages/api/api.js';

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
        console.log(searchTerm);

        try {
            

        } catch (err) {
            console.error(err);
        }


    },[searchTerm]);




    return(
        <div className="search-container">
            <FaSearch className="search-icon"/>
            <input 
                className="search-input" type="text" placeholder="Search by name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
}

export default SearchBar;