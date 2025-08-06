import React from 'react';
import '../styles/aboutUs.css';
import Footer from '../components/Footer'; // Adjust the path based on your project structure
import Header from '../components/Header';

const AboutUs = () => {
    return (
        <>
            <Header />
            <div className="aboutus-hero">
                <h1>About Us</h1>
                <p className="aboutus-tagline">Your ultimate destination for everything movies!</p>
            </div>
            <section className="aboutus-team">
                <h2>Meet the Team</h2>
                <div className="aboutus-team-cards">
                    <div className="aboutus-member-card">
                        <img src="/images/aboutUs/chheng.jpg" alt="Phorn Leangchheng" />
                        <h3>Phorn Leangchheng</h3>
                        <span className="aboutus-role">Founder & Developer</span>
                    </div>
                    <div className="aboutus-member-card">
                        <img src="/images/aboutUs/hong.jpg" alt="Yan Kimhong" />
                        <h3>Yan Kimhong</h3>
                        <span className="aboutus-role">Content Curator</span>
                    </div>
                    <div className="aboutus-member-card">
                        <img src="/images/aboutUs/hak.png" alt="Oeng Sunhak" />
                        <h3>Oeng Sunhak</h3>
                        <span className="aboutus-role">UI/UX Designer</span>
                    </div>
                </div>
            </section>
            <section className="aboutus-info">
                <h2>Why Choose Us?</h2>
                <p>We are a passionate team of cinephiles dedicated to bringing you the latest updates, reviews, and insights from the world of cinema. Whether you're a fan of Hollywood blockbusters, indie films, or international cinema, we have something for everyone.</p>
                <ul className="aboutus-list">
                    <li>Quality content and honest reviews</li>
                    <li>Latest movie news and updates</li>
                    <li>Friendly and welcoming community</li>
                    <li>Expert recommendations</li>
                </ul>
                <p className="aboutus-cta">So grab your popcorn, dive in, and let's explore the world of cinema together!</p>
            </section>
            <Footer />
        </>
    );
};

export default AboutUs;
