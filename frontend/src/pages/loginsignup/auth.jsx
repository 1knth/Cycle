import './auth.css';
import { useState, useEffect } from 'react';
import logo from '../../assets/whitename.png';
import email_icon from '../../assets/email.png';
import user_icon from '../../assets/person.png';
import password_icon from '../../assets/password.png';
import Navbar from '../../components/navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { syncTransactions, signup, login } from '../api/api.js';

function Signup() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [action, setAction] = useState("Signup");
    let lever = () => action === "Signup" ? "Login" : "Sign Up";
    let plever = () => action === "Signup" ? "Already a member? " : "Don't have an account? " ;
    let b2uttonText = () => action === "Signup" ? "Sign Up" : "Enter";
    const navigate = useNavigate();
    useEffect(() => {
        if (isLoading) {
            document.body.style.cursor = 'wait';
        } else {
            document.body.style.cursor = 'default'
        }
    }, [isLoading]);
    
    const handleSubmit = async (e) => { 
        setLoading(true);
        e.preventDefault(); 

        const payload = action === "Signup" ? { username, email, password } : { username, password };
        try {
            const data = action === "Signup" 
                ? await signup(payload)
                : await login(payload);
            
            localStorage.setItem("token", data.accessToken);
            
            console.log("Success!", data);
            
            if (data.hasBankLinked) {
                try {
                    await syncTransactions();
                    console.log("Transactions synced successfully");
                } catch (syncErr) {
                    console.error("Bank account not linked", syncErr);
                }
            }
            
            navigate('/dashboard');
            
        } catch (err) {
            console.error("Error:", err.response ? err.response.data : err.message);
        } finally { setLoading(false); }
    }

    return (
        <div> 
            <nav className="navbar-container">
                <Navbar />
            </nav>
            <section className="login-container"> 
                <form className="login-box" onSubmit={handleSubmit}>
                    <h2>demo login - tester:1234</h2>
                    <img className="cycle" src={logo} alt=''></img>
                    <div className={action==="Signup" ? "inputs" : "hidden"}>
                        <img src={email_icon} alt=''></img>
                        <input name="email"type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className= {"inputs"}>
                        <img src={user_icon} alt=''></img>
                        <input name="username"type="text" placeholder="User" onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className="inputs">
                        <img src={password_icon} alt=''></img>
                        <input name="password"type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    
                    <div className='buttons-box'>
                        <div className="buttons">
                            <button type="submit">{b2uttonText()}</button>
                        </div>
                    </div>
                    
                    <p>{plever()} <a onClick={() => {
                        if (action === "Signup") {
                            setAction("Login");
                        } else {
                            setAction("Signup");
                        }
                    }}>{lever()}</a></p>
                </form>
            </section>
        </div>
    );
}

export default Signup;