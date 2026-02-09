import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home.js';
import Auth from './pages/loginsignup/auth.js';
import Dashboard from './pages/dashboard/dashboard.js'
import Overview from './components/overview/Overview.js'
import Analytics from './components/analytics/Analytics.js';
import Transactions from './components/transactions/Transactions.js';
import Settings from './components/settings/Settings.js';

function App() {
  
  return (
    <BrowserRouter>
      <div className="App">
        <header className="router-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />}>
            <Route path="overview" element={<Overview />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="transactions" element={<Transactions />}/>
            <Route path="settings" element={<Settings />}/>
            </Route>
          </Routes>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
