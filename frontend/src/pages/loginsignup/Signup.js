import './Login.css';
import { useState } from 'react';
import logo from '../../assets/whitename.png';
import email_icon from '../../assets/email.png';
import user_icon from '../../assets/person.png';
import password_icon from '../../assets/password.png';
import axios from 'axios';
import Navbar from '../../components/navbar/Navbar';

function Signup() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [action, setAction] = useState("Signup");
    var lever = () => action === "Signup" ? "Login" : "Sign Up";
    var plever = () => action === "Signup" ? "Already a member? " : "Don't have an account? " ;
    var b2uttonText = () => action === "Signup" ? "Sign Up" : "Enter";
    
    const handleSubmit = (e) => { 
        if (action === "Signup") {
            
            e.preventDefault();
            axios.post('', {username, email, password})
            .then(response => console.log(response))
            .catch(err => console.log(err))
            
        } else if (action === "Login") {
            e.preventDefault();
            axios.post('', {username, password})
            .then(response => console.log(response))
            .catch(err => console.log(err))
        } else {
            console.log("Error in form submission");
        }
    }

    return (
        <div> 
            <navbar className="navbar-container">
                <Navbar />
            </navbar>
            <section className="login-container"> 
                <form className="login-box" onSubmit={handleSubmit}>
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
                            <button>{b2uttonText()}</button>
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