import './Overview.css';
// import database query

function Overview() {
    const balance = 12.98
    return (
        <section>
            <div className="cards-container"></div>
                <div className="cards">
                    <div className="daily-spend-title">   
                        <p>Daily Spending</p>
                    </div>
                    <div className="daily-spend-amount">   
                        <h2>${balance}</h2>
                    </div>
                </div>
                <div className="cards">
                    <div className="daily-spend-title"> 
                        <p>Daily Spending</p>
                    </div>
                    <div className="daily-spend-amount">   
                        <h2>${balance}</h2>
                    </div>
                </div>
                <div className="cards">
                    <div className="daily-spend-title"> 
                        <p>Daily Spending</p>
                    </div>
                    <div className="daily-spend-amount">   
                        <h2>${balance}</h2>
                    </div>
                </div>
        </section>
    )
}

export default Overview;