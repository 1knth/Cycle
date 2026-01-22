import './Card.css';


// import database query

function Card({name, data, kpi}) {

    return (
        <div className="cards">
            <div className="card-text-container">
                <div className="title">   
                    {/* <p>{name}</p> */}
                    <p>Balance</p>
                </div>
                <div className="amount">   
                    {/* <div>{data}</div> */}
                    <div>$400,000</div>
                </div>
                <div className="kpi">
                    {/* <div>{kpi}</div> */}
                    <div>142% Gain (1y)</div>
                </div>
            </div>
        </div>
    )
}

export default Card;