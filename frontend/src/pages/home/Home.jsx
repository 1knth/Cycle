import "../../assets/fonts/font.css";
import './Home.css';
import card from '../../assets/card.png';
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
                    <h1>Spend because you can <span>Afford</span> to.</h1>
                    <section className="text-container" >
                        <div className="divider" ></div>
                        <p>
                            <br/> Cycle turns transactional data into clear suggestions by using quantitative analysis
                            <br/> and creates a budget tailored for you—so decisions feel <span>obvious</span>, not emotional.​
                        </p>
                    </section>
                    <section className="button-container">
                        <Link to='/dashboard'className="reg-cta" >Try Demo &nbsp;&nbsp;&gt; </Link>
                        <a href="#target-why" className="why-cta">Why Cycle?</a>
                    </section>
                    <div className="card"><img src={card}></img></div>
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
            <footer>
                
            </footer>
        </div>
    );
}

export default Home;