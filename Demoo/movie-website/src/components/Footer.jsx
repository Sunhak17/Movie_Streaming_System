import React from 'react';

const Footer = () => {
    const footerStyle = {
        background: '#111',
        color: '#fff',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    };

    const appSectionStyle = {
        background: '#111',
        textAlign: 'center',
        padding: '2.5rem 2rem 1.5rem 2rem'
    };

    const appTitleStyle = {
        fontSize: '2rem',
        fontWeight: '700',
        marginBottom: '2.2rem',
        color: '#fff'
    };

    const experienceTextStyle = {
        color: '#19c37d',
        fontWeight: '700'
    };

    const platformIconsStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '2.5rem',
        flexWrap: 'wrap',
        maxWidth: '900px',
        margin: '0 auto 1.5rem auto'
    };

    const platformItemStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem'
    };

    const platformIconStyle = {
        background: '#444',
        padding: '0.5rem 2.2rem',
        borderRadius: '6px',
        height: '38px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.3rem',
        marginBottom: '0.2rem'
    };

    const platformSpanStyle = {
        fontSize: '1rem',
        color: '#fff',
        fontWeight: '400'
    };

    const footerContentStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '2.5rem',
        padding: '1.5rem 3rem 0.5rem 3rem',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#111',
        borderTop: '1.5px solid #666'
    };

    const footerHeadingStyle = {
        fontSize: '1.05rem',
        marginBottom: '1.1rem',
        color: '#fff',
        fontWeight: '700'
    };

    const greenTextStyle = {
        color: '#19c37d',
        fontWeight: '700'
    };

    const footerLinksStyle = {
        listStyle: 'none',
        padding: '0',
        margin: '0'
    };

    const footerLinkItemStyle = {
        marginBottom: '0.7rem'
    };

    const footerLinkStyle = {
        color: '#ccc',
        textDecoration: 'none',
        fontSize: '0.95rem',
        fontWeight: '400'
    };

    const footerBottomStyle = {
        textAlign: 'left',
        marginTop: '1.2rem'
    };

    const copyrightStyle = {
        margin: '0',
        color: '#ccc',
        fontSize: '0.85rem',
        fontWeight: '400'
    };

    return (
        <footer style={footerStyle}>
            {/* App Experience Section */}
            <div style={appSectionStyle}>
                <h2 style={appTitleStyle}>
                    Get the Best <span style={experienceTextStyle}>Experience on the APP</span>
                </h2>
                <div style={platformIconsStyle}>
                    <div style={platformItemStyle}>
                        <div style={platformIconStyle}>📱</div>
                        <span style={platformSpanStyle}>Phone</span>
                    </div>
                    <div style={platformItemStyle}>
                        <div style={platformIconStyle}>💻</div>
                        <span style={platformSpanStyle}>Computer</span>
                    </div>
                    <div style={platformItemStyle}>
                        <div style={platformIconStyle}>📺</div>
                        <span style={platformSpanStyle}>TV</span>
                    </div>
                    <div style={platformItemStyle}>
                        <div style={platformIconStyle}>🌐</div>
                        <span style={platformSpanStyle}>Web</span>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div style={footerContentStyle}>
                <div>
                    <h3 style={footerHeadingStyle}>About <span style={greenTextStyle}>WATCH2DAY</span></h3>
                    <ul style={footerLinksStyle}>
                        <li style={footerLinkItemStyle}>
                            <a href="/about" style={footerLinkStyle}>About us</a>
                        </li>
                        <li style={footerLinkItemStyle}>
                            <a href="/products" style={footerLinkStyle}>Product and services</a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 style={footerHeadingStyle}>Cooperation</h3>
                    <ul style={footerLinksStyle}>
                        <li style={footerLinkItemStyle}>
                            <a href="/advertise" style={footerLinkStyle}>Advertise</a>
                        </li>
                        <li style={footerLinkItemStyle}>
                            <a href="/corporate" style={footerLinkStyle}>Corporate relations</a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 style={footerHeadingStyle}>Help and <span style={greenTextStyle}>support</span></h3>
                    <ul style={footerLinksStyle}>
                        <li style={footerLinkItemStyle}>
                            <a href="/feedback" style={footerLinkStyle}>Feedback</a>
                        </li>
                        <li style={footerLinkItemStyle}>
                            <a href="/security" style={footerLinkStyle}>Security Response Center</a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 style={footerHeadingStyle}>Term of <span style={greenTextStyle}>service</span></h3>
                    <ul style={footerLinksStyle}>
                        <li style={footerLinkItemStyle}>
                            <a href="/privacy" style={footerLinkStyle}>Privacy Policy</a>
                        </li>
                        <li style={footerLinkItemStyle}>
                            <a href="/terms" style={footerLinkStyle}>Terms of Service</a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Copyright */}
            <div style={footerBottomStyle}>
                <p style={copyrightStyle}>Copyright ©2025 WATCH2DAY ALL Rights Reserved</p>
            </div>
        </footer>
    );
};

export default Footer;
