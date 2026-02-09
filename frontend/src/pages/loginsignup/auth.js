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
    var lever = () => action === "Signup" ? "Login" : "Sign Up";
    var plever = () => action === "Signup" ? "Already a member? " : "Don't have an account? " ;
    var b2uttonText = () => action === "Signup" ? "Sign Up" : "Enter";
    
    // const handleSubmit = (e) => { 
    //     if (action === "Signup") {

    //         e.preventDefault();
    //         try {
    //             axios.post('http://localhost:5001/auth/signup', {username, email, password})
    //             .then(response => console.log(response))
    //             .catch(err => console.log(err))
    //         } catch (error) {
    //             console.log(error);
    //         }
            
    //     } else if (action === "Login") {
    //         e.preventDefault();
    //         try {
    //             axios.post('http://localhost:5001/auth/login', {username, password})
    //             .then(response => console.log(response))
    //             .catch(err => console.log(err))
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     } else {
    //         console.log("Error in form submission");
    //     }
    // }
    const navigate = useNavigate();
    const handleSubmit = async (e) => { 
        // 1. Move this to the VERY top. 
        // This guarantees the page never reloads, even if your code crashes below.
        e.preventDefault(); 

        // 2. Define the endpoint based on the action
        const endpoint = action === "Signup" ? 'http://localhost:5001/auth/signup' : 'http://localhost:5001/auth/login';

        const payload = action === "Signup" ? { username, email, password } : { username, password };

        try {
            // 3. Use await instead of .then()
            const response = await axios.post(endpoint, payload);
            const data = response.data;
            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("token", data.accessToken);
            console.log("Success!", response.data);
            
            // TODO: Redirect user to dashboard here
            navigate('/dashboard');
            
        } catch (err) {
            // 4. This catches BOTH network errors and code errors
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