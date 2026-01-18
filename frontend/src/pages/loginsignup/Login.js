import './Login.css';
import { use, useState } from 'react';
import logo from '../../assets/logo.png';
import Signup from './Signup.js';
import Navbar from '../../components/navbar/Navbar.js'


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    return (
        <div>
            <Signup />
        </div>
    );
}

// function loginPage(state, setState) {
//     <section className="login-container"> 
//         <div className="login-box">
//             <img src={logo} alt=''></img>
//             <form className="login-form">
//                 <input name="username"type="text" placeholder="Username"></input>
//                 <input name="password"type="password" placeholder="Password"></input>
//                 <button>Login</button>
//             </form>
//             <p>Don't have an account? <a>Sign up</a> </p>
//         </div>
//     </section>
// }

export default Login;