import './LinkBank.css';
import PlaidLinkButton from './PlaidLinkButton.jsx'
// import '../overview/dash-component.css';

function LinkAccount({ onLinked }) {

    return (
        <section className="Link-Plaid-Container">
            <div className='Card'>
                <h1>Link Your Transaction History</h1>
                {<PlaidLinkButton onLinked={onLinked}/>}
                <p>Supported by over 100+ banks!</p>
            </div>
        </section>
    )
}

export default LinkAccount;