import {useState}from 'react';
import './SearchBar.css';
import {FaSearch} from 'react-icons/fa';
import {getTransactions} from '../../pages/api/api.js';

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = async () => {
        try {
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    return(
        <div className="search-container">
            <FaSearch className="search-icon"/>
            <input 
                className="search-input" type="text" placeholder="Search transactions..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
        </div>
    )
}

export default SearchBar;