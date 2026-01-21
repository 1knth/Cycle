import './Overview.css';
import DailySpend from './subcomponents/DailySpend.js';
// import database query

function Overview() {
    return (
        <section>
            <div className="cards-container">
                <div className="overview-cards">
                    <div className="title">   
                        <p>Balance</p>
                    </div>
                    <div className="amount">   

                    </div>
                </div>
                <div className="overview-cards">
                    <div className="title">   
                        <p>Daily Spending</p>
                    </div>
                    <div className="amount">   
                        <DailySpend/>
                    </div>
                </div>
                <div className="overview-cards">
                    <div className="title"> 
                        <p>Monthly Spending</p>
                    </div>
                    <div className="amount">   

                    </div>
                </div>
                <div className="overview-cards">
                    <div className="title"> 
                        <p>Growth</p>
                    </div>
                    <div className="amount">   

                    </div>
                </div>
                <div className="overview-cards">
                    <div className="title"> 
                        <p>Markets</p>
                    </div>
                    <div className="amount">   

                    </div>
                </div>
            </div>
        </section>
    )
}

export default Overview;