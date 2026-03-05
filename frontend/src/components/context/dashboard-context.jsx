import { createContext, useState } from 'react';

const DashboardContext = createContext();
export const DashboardProvider = ({ children }) => {
    const [timeRange, setTimeRange] = useState('1M');
    
    return (
        <DashboardContext.Provider value={{ timeRange, setTimeRange }}>
            {children}
        </DashboardContext.Provider>
    );
};