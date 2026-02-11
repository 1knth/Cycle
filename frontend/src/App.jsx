import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home.jsx';
import Auth from './pages/loginsignup/auth.jsx';
import Dashboard from './pages/dashboard/dashboard.jsx'
import Overview from './components/overview/Overview.jsx'
import Analytics from './components/analytics/Analytics.jsx';
import Transactions from './pages/transactions/transactions-page.jsx';
import Settings from './components/settings/Settings.jsx';

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
