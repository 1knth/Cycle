import {useState} from 'react';
import {useAccount} from '../../components/context/context.jsx';
import './Account-Selector.css';
import triangle from '../../assets/dropdown.svg';

const AccountSelector = () => {
    const [selection, setSelection] = useState(false);
    const { accounts, selectedAccount, setSelectedAccount, loading } = useAccount();

    const handleAccountSelect = (account) => {
        setSelectedAccount(account);
        setSelection(false);
    };
    
    const listAccounts = accounts.map(
        (account) => (
            <div onClick={() => handleAccountSelect(account)} className="account">
                <div style={{width:'80%'}}>
                    <li key={account.id+ "-name"}>{account.name}</li>
                    <li style={{fontSize: '0.8rem', opacity:'50%'}} key={account.id + "-institution"}>{account.institution}</li>
                </div>
                <div style={{width:'20%'}}>
                    <li style={{fontWeight: '700'}} key={account.id + "-mask"}>{account.mask}</li>
                </div>
            </div>
        )
    )

    if (loading) {
        return (
            <div className="account-selector-loading">Loading...</div>
        )
    }

    return (
        <>
            {selection ? 
            <div className='dropdown' >
                <div className="accounts-container">
                    <div className="accounts">
                        <div onClick={() => handleAccountSelect({name: "All Accounts", id: "all"})} className="account">
                            <li style={{fontWeight: 600, fontSize: 1.4 + 'rem'}}>All Accounts</li>
                        </div>
                        {listAccounts}
                    </div>
                </div>
            </div>
            :
            <div></div>
            }
                <button className="account-selector" onClick={() => setSelection(true)} > 
                        <div>
                            <img src={triangle}/> 
                            <div style={{padding: '0 0 0 2px', background: 'black', opacity: '30%', borderRadius:'0rem'}}></div>
                            <p style={{fontWeight:'300'}}>{selectedAccount?.name}</p>
                            <p style={{fontWeight:'700'}}>{selectedAccount?.mask}</p>
                        </div>
                </button>
        </>
    )
}

export default AccountSelector;