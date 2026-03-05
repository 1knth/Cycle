import { createContext, useContext, useState, useEffect } from 'react';
import { getAccounts } from '../../pages/api/api.js';

export const IsLoggedIn = () => {
    return !!localStorage.getItem('token');
}

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('1M');
    useEffect(() => {
        const loadAccounts = async () => {
            try {
                setLoading(true);
                const accountsData = await getAccounts();
                const accList = accountsData.accounts || [];
                
                setAccounts(accList);
                
                const defaultAccount = (accList.length > 0) 
                ? accList[0] 
                : { id: 'all', name: 'All Accounts' };
                setSelectedAccount(defaultAccount);
            } catch (err) {
                console.error('Error loading accounts:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadAccounts();
    }, []);

    const value = {
        accounts,
        selectedAccount,
        setSelectedAccount,
        timeRange,
        setTimeRange,
        loading,
        error
    };

    return (
        <AccountContext.Provider value={value}>
            {children}
        </AccountContext.Provider>
    );
};

export const useAccount = () => {
    const context = useContext(AccountContext);
    if (context === undefined) {
        throw new Error('useAccount must be used within an AccountProvider');
    }
    return context;
};