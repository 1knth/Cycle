import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home.js';
import Navbar from './components/navbar/Navbar.js';
import Signup from './pages/loginsignup/Signup.js';
import Dashboard from './pages/dashboard/dashboard.js'
import Overview from './components/overview/Overview.js'
import Analytics from './components/analytics/Analytics.js';
import Transactions from './components/transactions/Transactions.js';

function App() {
  
  return (
    <BrowserRouter>
      <div className="App">
        {/* <navbar className="navbar-container">
          <Navbar />
        </navbar> */}
        <header className="router-container">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/mission" element={<Mission />} /> */}
            {/* <Route path="/products" element={<Products />} /> */}
            <Route path="/login" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />}>
            <Route path="overview" element={<Overview />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="transactions" element={<Transactions />}/>
            </Route>
          </Routes>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
