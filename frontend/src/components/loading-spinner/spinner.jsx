import React from 'react';
import './spinner.css';
import logo from '../../assets/spinner.svg';

function spinner() {
    return (
        <div className="spinner-container">
            <img src={logo} alt="Loading spinner" className="spinner" />
        </div>
    );
}

export default spinner;