import "../../assets/fonts/font.css";
import './Home.css';
import card from '../../assets/card.png';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/navbar/Navbar";

function Home () {
    const navigate = useNavigate();
    const button = () => {
        navigate('/dashboard/overview')
    }

    return (
        // <img src=''></img>
        <div>
            <navbar className="navbar-container">
                <Navbar />
            </navbar>
            <section className="hero-container">
                <h1>Financial Freedom Begins Here.</h1>
                <div className="text-container" >
                    <div className="divider" ></div>
                    <p>
                        Take control of your finances with our intuitive budgeting tools. 
                        <br/>Return <span>more</span> than the yearly average from the S&P500. 
                        <br/>Our custom AI agent will analyze risk and advise on your every day financial decisions.
                    </p>
                    <button onClick={button}>Get Started</button>
                </div>
                <div className="card"><img src={card}></img></div>
            </section>
        </div>
    );
}

export default Home;