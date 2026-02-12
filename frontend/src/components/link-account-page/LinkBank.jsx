import './LinkBank.css';
import PlaidLinkButton from './PlaidLinkButton.jsx'
import {IsLoggedIn} from '../context/context.jsx';

function LinkAccount({ onLinked }) {

    return (
        <>
            {IsLoggedIn() ?
                (<section className="Link-Plaid-Container">
                    <div className='Card'>
                        <h1>Link Your Transaction History</h1>
                        {<PlaidLinkButton onLinked={onLinked}/>}
                        <p>Supported by over 100+ banks!</p>
                    </div>
                </section> )
                :
                (<div></div>) 
            }
        </>
    )
}

export default LinkAccount;