import React, { useEffect, useState } from 'react';
import '../styles/landing.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDashboard, faEnvelope, faHeart, faGear, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Link } from 'react-router-dom';

const Navbar = ({ username }) => {
    const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const navToggle = document.querySelector('.nav-toggle');
    navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('html').classList.toggle('openNav');
      setIsOpen(!isOpen);
    });


  }, [isOpen]);
  
  return (
    <div>
    <div className={`primary-nav ${isOpen ? 'openNav' : ''}`}>
      <button className="hamburger nav-toggle">
        <span className="screen-reader-text">Menu</span>
      </button>

      <nav role="navigation" className="menu">
      <Link to="/landing" className="logotype">Cho<span>rds</span></Link>

        <div className="overflow-container">
          <ul className="menu-dropdown">
            <li><a href="/insights">Insights</a><span className="icon"><FontAwesomeIcon icon={faDashboard} /></span></li>
            <li><a href="/messages">Messages</a><span className="icon"><FontAwesomeIcon icon={faEnvelope} /></span></li>
            <li><a href="#">Matches</a><span className="icon"><FontAwesomeIcon icon={faHeart} /></span></li>
            <li className="menu-hasdropdown">
              <a href="#">Settings</a><span className="icon"><FontAwesomeIcon icon={faGear} /></span>
              <label title="toggle menu" htmlFor="settings">
                <span className="downarrow"><FontAwesomeIcon icon={faCaretDown} /></span>
              </label>
              <input type="checkbox" className="sub-menu-checkbox" id="settings" />
              <ul className="sub-menu-dropdown">
                <li><a href="">Profile</a></li>
                <li><a href="">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </div>
  )
}

export default Navbar

