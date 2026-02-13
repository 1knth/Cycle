import './auth.css';
import { useState } from 'react';
import logo from '../../assets/whitename.png';
import email_icon from '../../assets/email.png';
import user_icon from '../../assets/person.png';
import password_icon from '../../assets/password.png';
import axios from 'axios';
import Navbar from '../../components/navbar/Navbar';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [action, setAction] = useState("Signup");
    let lever = () => action === "Signup" ? "Login" : "Sign Up";
    let plever = () => action === "Signup" ? "Already a member? " : "Don't have an account? " ;
    let b2uttonText = () => action === "Signup" ? "Sign Up" : "Enter";
    const navigate = useNavigate();

    const handleSubmit = async (e) => { 
        e.preventDefault(); 

        const endpoint = action === "Signup" ? 'http://localhost:5001/auth/signup' : 'http://localhost:5001/auth/login';
        const payload = action === "Signup" ? { username, email, password } : { username, password };

        try {
            const response = await axios.post(endpoint, payload);
            const data = response.data;
            // localStorage.setItem("user", JSON.stringify(data));
            // localStorage.setItem("token", data.accessToken);
            
            // Store bank details for immediate dashboard access
            if (data.hasBankLinked) {
                // localStorage.setItem("hasBankLinked", "true");
                // localStorage.setItem("plaidItemId", data.plaidItemId || "");
            } else {
                // localStorage.setItem("hasBankLinked", "false");
                // localStorage.removeItem("plaidItemId");
            }
            
            console.log("Success!", response.data);
            
            navigate('/dashboard');
            
        } catch (err) {
            console.error("Error:", err.response ? err.response.data : err.message);
        }
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