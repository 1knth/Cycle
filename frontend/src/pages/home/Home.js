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
        <div className="home-wrapper">
            <navbar className="navbar-container">
                <Navbar />
            </navbar>
            <section className="hero-container">
                <h1>Spend because you can <span>Afford</span> to.</h1>
                <div className="text-container" >
                    <div className="divider" ></div>
                    <p>
                        <br/> Cycle turns transactional data into clear suggestions by using quantitative analysis
                        <br/> and creates a budget tailored for you—so decisions feel <span>obvious</span>, not emotional.​
                    </p>
                    <button onClick={button}>Get Started</button>
                </div>
                <div className="card"><img src={card}></img></div>
            </section>
            <section className="about-section">
                <div className="points-container">
                    <p className="points">
                        <br/> &gt; a budget that adapts to your life.
                        <br/> &gt; see every transaction.
                        <br/> &gt; spot risk early.
                    </p>
                </div>
            </section>
        </div>
    );
}

export default Home;