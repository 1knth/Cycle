import './LinkBank.css';
import PlaidLinkButton from './PlaidLinkButton.jsx'

function LinkAccount({ onLinked }) {

    return (
        <>
            {!!localStorage.getItem('token') 
            ? (<section className="Link-Plaid-Container">
                    <div className='Card'>
                        <div className="wrapper">
                            <div className="card-text-container">                           
                                <h1>Link Transactions</h1>
                                <p>Supported by over 100+ banks!</p>
                            </div>
                        {   <PlaidLinkButton onLinked={onLinked}/>}
                        </div>
                    </div>
                </section> )
            :
                (<div></div>) 
            }
        </>
    )
}

export default LinkAccount;
