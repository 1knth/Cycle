import './NumberCard.css';
import logo from '../../assets/logo.png';
import settingsIcon from '../../assets/whiteSettingsIcon.svg';

// import database query

function Card({type, name, data, kpi}) {
// Checks the gain/loss and updates the corresponding arrow direction on UI

    const flipArrow = () => {
        const monthlyspend = 0;

    }
    const showSettingsIcon = () => {
        if (name === "Bills (Monthly)") {
            return (
                <img src={settingsIcon}/>
            )
        }
    }

    return (
        <div className={type}>
            <div className="card-text-container">
                <div className="title">   
                    <p>{name}</p>
                    <div className="manage-settings"> {showSettingsIcon()}</div>
                </div>
                <div className="amount">   
                    <div>{data}</div>
                </div>
                <div className="kpi">
                    <div>{kpi}</div>
                    {/* <img src={settingsIcon}></img> */}
                </div>
            </div>
        </div>
    );
};

export default Card;