import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>Campus Innovation Hub</h3>
          <p>A platform for college students to collaborate, innovate, and build the future together.</p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Navigate</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/find-teammates">Find Teammates</Link></li>
              <li><Link to="/hackathons">Hackathons</Link></li>
              <li><Link to="/mentors">Mentors</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Features</h4>
            <ul>
              <li><Link to="/ideas">Project Ideas</Link></li>
              <li><Link to="/showcase">Project Showcase</Link></li>
              <li><Link to="/register">Join Now</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Campus Innovation Hub. All rights reserved.</p>
      </div>
    </footer>
  )
}
