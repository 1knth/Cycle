import "../../assets/fonts/font.css";
import './Home.css';
import card from '../../assets/dashboard.png';
import { Link } from 'react-router-dom';
import Navbar from "../../components/navbar/Navbar";

function Home () {

    return (
        <div className="home-wrapper">
            <header className="navbar-container">
                <Navbar />
            </header>
            <main>
                <div className="hero-container">
                    <section className="text-container" >
                        <h1>Spend Because You <span>Can</span></h1>
                        <p>
                            <br/> Cycle turns transactional data into clear suggestions via our analysis tools
                            <br/> to create a tailored budget for you—so decisions feel <span>obvious</span>, not emotional.​
                        </p>
                    </section>
                    <section className="button-container">
                        <Link to='/dashboard'className="reg-cta" >Try Demo &nbsp;&nbsp;&gt; </Link>
                        <a href="#target-why" className="why-cta">Why Cycle?</a>
                    </section>
                </div>
                <div className="card">
                    <img src={card} alt='dashboard'/>
                </div>
                <div id="target-why"></div>
                <section className="about-section">
                    <div className="points-container">
                        <p className="points">
                            <br/> &gt; a budget that adapts to your life.
                            <br/> &gt; see every transaction.
                            <br/> &gt; spot risk early.
                        </p>
                    </div>
                </section>
            </main>
            <footer className="footer-container">
                <div className="footer-bar">
                    <div className="footer-text">
                        <p>Reach out at: knthyang gm@ildotcom</p>
                        <p id="footer-text-note">dodging web scrapes!</p>
                    </div>
                    <div className="footer-socials">
                        <p>github</p>
                        <p>linkedin</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;