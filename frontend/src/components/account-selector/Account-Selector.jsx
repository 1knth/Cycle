import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Account-Selector.css';
import triangle from '../../assets/dropdown.svg';

const AccountSelector = ({ accounts }) => {
    const [selection, setSelection] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const handleAccountSelect = (account) => {
        setSearchParams(prev => {
            prev.set('account', account.accountId || account.id);
            return prev;
        });
        setSelection(false);
    };

    const selectedAccountId = searchParams.get('account');
    const selectedAccount = accounts?.find(a => a.accountId === selectedAccountId);

    const listAccounts = accounts?.map(
        (account) => (
            <div onClick={() => handleAccountSelect(account)} className="account" key={account.id}>
                <div style={{width:'80%'}}>
                    <li key={account.id+ "-name"}>{account.name}</li>
                    <li style={{fontSize: '0.8rem', opacity:'70%'}} key={account.id + "-institution"}>{account.institution?.name}</li>
                </div>
                <div style={{width:'20%'}}>
                    <li style={{fontWeight: '700', textAlign: 'right'}} key={account.id + "-mask"}>{account.mask}</li>
                </div>
            </div>
        )
    )

    if (!accounts || accounts.length === 0) {
        return (
            <div className="account-selector-loading">No accounts</div>
        )
    }

    return (
        <>
            {selection ? 
            <div className='dropdown' >
                <div className="accounts-container">
                    <div className="accounts">
                        <div onClick={() => handleAccountSelect({name: "All Accounts", id: "all"})} className="account">
                            <li style={{ fontSize: 1.4 + 'rem'}}>All Accounts</li>
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
                            {/* <div style={{padding: '0 0 0 2px', background: 'black', opacity: '30%', borderRadius:'0rem'}}></div> */}
                            <p style={{fontWeight:'300'}}>{selectedAccount?.name || 'All Accounts'}</p>
                            <p style={{fontWeight:'700'}}>{selectedAccount?.mask || ''}</p>
                        </div>
                </button>
        </>
    )
}

export default AccountSelector;
