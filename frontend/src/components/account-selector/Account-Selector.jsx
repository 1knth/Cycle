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
        // <div className="account-selector-wrapper">
        //     <button 
        //         className="account-selector-btn"
        //         onClick={() => setShowDropdown(!showDropdown)}
        //     >
        //         {formatAccountDisplay(selectedAccount)}
        //         <span className="dropdown-arrow">▼</span>
        //     </button>
            
        //     {showDropdown && (
        //         <div className="account-dropdown">
        //             {/* All Accounts Option */}
        //             <div 
        //                 className={`account-option ${selectedAccount?.id === 'all' ? 'selected' : ''}`}
        //                 onClick={() => handleAccountSelect({ id: 'all', name: 'All Accounts' })}
        //             >
        //                 <h2 className="account-name">All Accounts</h2>
        //             </div>
                    
        //             {/* Grouped by Institution */}
        //             {Object.entries(groupedAccounts).map(([institution, instAccounts]) => (
        //                 <div key={institution} className="institution-group">
        //                     <div className="institution-name">{institution}</div>
        //                     {instAccounts
        //                         .sort((a, b) => (a.type || '').localeCompare(b.type || ''))
        //                         .map(account => (
        //                         <div
        //                             key={account.id}
        //                             className={`account-option ${selectedAccount?.id === account.id ? 'selected' : ''}`}
        //                             onClick={() => handleAccountSelect(account)}
        //                         >
        //                             <span className="account-name">
        //                                 {account.name} ...{account.mask}
        //                             </span>
        //                             <span className="account-balance">
        //                                 ${account.currentBalance?.toFixed(2) || '0.00'}
        //                             </span>
        //                         </div>
        //                     ))}
        //                 </div>
        //             ))}
        //         </div>
        //     )}
        // </div>


        <>
            {selection ? 
            <div className='dropdown' >
                <div className="accounts-container">
                    <h3>Accounts</h3>
                    <div className="accounts">
                        <div onClick={() => handleAccountSelect(
                            {
                                name: "All Accounts",
                            }   
                            )} className="account">
                            <li>All Accounts</li>
                        </div>
                        {listAccounts}
                    </div>
                </div>
            
            </div>
            :
            <button className="account-selector" onClick={() => setSelection(true)} > {selectedAccount?.name} {selectedAccount?.mask}</button>
            }
        </>
    )
}

export default AccountSelector;