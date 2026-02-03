import './Overview.css';
import NumberCard from "../cards/NumberCard.js"
import '../cards/dash-component.css';
import React, {useState, useEffect} from 'react';
// import database query

function Overview() {

    // no more than 4 regular sized cards on each row.
    // graph takes up 2 lengths, same for chart but also +2 height
    return (
        <section className="dash-component-container">
            <div className="cards-container">
                    <NumberCard
                        type="regular"
                        name="Account Balance" 
                        data="$87,324.54" 
                        kpi="+ 142% (1yr)"
                    />
                    <NumberCard
                        type="regular"
                        name="Monthly Spend" 
                        data="$4,564.67" 
                        kpi="- 0.73% (1mo)"
                    />
                    <NumberCard
                        type="regular"
                        name="Upcoming Bill" 
                        data="$452.52"
                        kpi="note: car payment" 
                    />
                    <NumberCard
                        type="regular"
                        name="Bills (Monthly)" 
                        data="$3,556.32" 
                    />
            </div>
            <div className="cards-container-2">
                <NumberCard
                    type="chart"
                    name="Spending Chart" 
                    data="32"
                />
                
            </div>

        </section>
    )
}

export default Overview;