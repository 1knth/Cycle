import './Overview.css';
import Card from "../card/Card.js"
import React, {useState, useEffect} from 'react';
// import database query

function Overview() {
    return (
        <section className="overview-section">
            <div className="cards-container">
                <div className="overview-cards">
                    <Card/>
                </div>
                <div className="overview-cards">

                </div>
                <div className="overview-cards">

                </div>
                <div className="overview-cards">

                </div>
                <div className="overview-cards">

                </div>
            </div>
        </section>
    )
}

export default Overview;