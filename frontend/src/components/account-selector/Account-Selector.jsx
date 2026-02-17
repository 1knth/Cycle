import {useState} from 'react';
import {useAccount} from '../../components/context/context.jsx';
import './Account-Selector.css';

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
                <li key={account.id+ "-name"}>{account.name}</li>
                <li key={account.id + "-mask"}>{account.mask}</li>
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
            <button className="account-selector" onClick={() => setSelection(true)} > {selectedAccount?.name} {selectedAccount?.mask}</button>
        </>
    )
}

export default AccountSelector;