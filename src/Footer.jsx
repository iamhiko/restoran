import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa"; // Sosyal medya ikonlarını ekledik.
import './Footer.css';

function Footer() {
    return (
        <div>
            <footer className="footer">
                <div className="line"></div>
                <div className="footer-content">
                    <p className="footerbasligi">
                        Copyright © 2025 Virtus ArGe. Her hakkı saklıdır.
                    </p>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Footer;