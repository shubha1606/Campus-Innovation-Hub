import { Link } from 'react-router-dom'
import './Home.css'

const features = [
  { emoji: '🤝', title: 'Find Teammates', desc: 'Discover students based on skills, branch, year, and interests.', to: '/find-teammates' },
  { emoji: '🎯', title: 'Skill Matching', desc: 'Find potential teammates whose skills match your project requirements.', to: '/find-teammates' },
  { emoji: '💡', title: 'Project & Startup Ideas', desc: 'Discover and share innovative project and startup ideas.', to: '/ideas' },
  { emoji: '🏆', title: 'Hackathons', desc: 'Explore upcoming hackathons and participate in exciting challenges.', to: '/hackathons' },
  { emoji: '🧑‍🏫', title: 'Mentor Booking', desc: 'Connect with experienced mentors and schedule mentoring sessions.', to: '/mentors' },
  { emoji: '🚀', title: 'Project Showcase', desc: 'Showcase completed projects, technologies, GitHub links, and demos.', to: '/showcase' },
]

const steps = [
  { num: '01', title: 'Create Your Profile', desc: 'Set up your student profile with your college, branch, year, skills, interests, and biography.' },
  { num: '02', title: 'Find Your Team', desc: 'Search and discover students based on skills and interests.' },
  { num: '03', title: 'Build & Collaborate', desc: 'Work together on innovative projects and startup ideas.' },
  { num: '04', title: 'Showcase Your Work', desc: 'Share your completed projects with the campus community.' },
]

const projectIdeas = [
  { title: 'AI-Powered Campus Assistant', desc: 'A smart chatbot that helps students navigate campus resources, schedules, and FAQs using NLP.', tech: ['Python', 'React', 'NLP'] },
  { title: 'Smart Water Quality Monitor', desc: 'IoT-based system to monitor and report water quality in real time across campus facilities.', tech: ['IoT', 'Node.js', 'MongoDB'] },
  { title: 'Student Skill Exchange', desc: 'A peer-to-peer platform where students teach and learn skills from each other.', tech: ['React', 'Express', 'PostgreSQL'] },
  { title: 'Smart Waste Management', desc: 'Sensor-based waste bin monitoring system with route optimization for campus cleaning staff.', tech: ['IoT', 'Python', 'Maps API'] },
]

const hackathons = [
  { name: 'InnovateTech 2025', date: 'Aug 15–16, 2025', mode: 'Online', desc: 'A 24-hour hackathon focused on building solutions for smart cities and sustainability.' },
  { name: 'CodeStorm Hackathon', date: 'Sep 5–6, 2025', mode: 'Offline – Mumbai', desc: 'Build innovative web and mobile apps that solve real-world campus problems.' },
  { name: 'AI for Good Challenge', date: 'Oct 10–11, 2025', mode: 'Hybrid', desc: 'Use AI and machine learning to create impactful solutions for social good.' },
]

const mentors = [
  { name: 'Dr. Priya Sharma', expertise: 'AI & Machine Learning', desc: 'Professor at IIT with 10+ years of experience in AI research and startup mentoring.' },
  { name: 'Rahul Mehta', expertise: 'Full Stack Development', desc: 'Senior engineer at a leading tech company, passionate about helping students build real products.' },
  { name: 'Ananya Iyer', expertise: 'Product Management', desc: 'Product Manager with experience at top startups, specializing in EdTech and HealthTech.' },
]

const showcaseProjects = [
  { name: 'CampusConnect App', desc: 'A mobile app connecting students across departments for collaborative learning and events.', tech: ['React Native', 'Firebase'], github: '#', demo: '#' },
  { name: 'EcoTrack Dashboard', desc: 'Real-time dashboard tracking campus energy consumption and suggesting eco-friendly alternatives.', tech: ['React', 'Node.js', 'Chart.js'], github: '#', demo: '#' },
  { name: 'MediAssist Portal', desc: 'A student health portal for booking appointments, accessing medical records, and health tips.', tech: ['React', 'Express', 'MongoDB'], github: '#', demo: '#' },
]

export default function Home() {
  return (
    <main className="home">

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>Connect. Collaborate. Innovate.</h1>
          <p>Campus Innovation Hub helps students find teammates, discover ideas, connect with mentors, participate in hackathons, and showcase their projects.</p>
          <div className="hero-btns">
            <Link to="/find-teammates" className="btn-primary">Find Teammates</Link>
            <Link to="/showcase" className="btn-outline">Explore Projects</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Everything You Need to Innovate</h2>
          <div className="grid-3">
            {features.map((f) => (
              <div className="feature-card" key={f.title}>
                <span className="feature-emoji">{f.emoji}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <Link to={f.to} className="card-link">Explore →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">How Campus Innovation Hub Works</h2>
          <div className="grid-4">
            {steps.map((s) => (
              <div className="step-card" key={s.num}>
                <span className="step-num">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Ideas */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Explore Project Ideas</h2>
            <Link to="/ideas" className="view-all">View All Ideas →</Link>
          </div>
          <div className="grid-4">
            {projectIdeas.map((p) => (
              <div className="card" key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="tech-tags">
                  {p.tech.map((t) => <span className="tag" key={t}>{t}</span>)}
                </div>
                <Link to="/ideas" className="btn-card">View Idea</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hackathons */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Upcoming Hackathons</h2>
            <Link to="/hackathons" className="view-all">View All →</Link>
          </div>
          <div className="grid-3">
            {hackathons.map((h) => (
              <div className="card" key={h.name}>
                <span className="badge">{h.mode}</span>
                <h3>{h.name}</h3>
                <p className="card-meta">📅 {h.date}</p>
                <p>{h.desc}</p>
                <Link to="/hackathons" className="btn-card">View Details</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Learn From Experienced Mentors</h2>
            <Link to="/mentors" className="view-all">View All →</Link>
          </div>
          <div className="grid-3">
            {mentors.map((m) => (
              <div className="card mentor-card" key={m.name}>
                <div className="mentor-avatar">{m.name.charAt(0)}</div>
                <h3>{m.name}</h3>
                <span className="badge badge-blue">{m.expertise}</span>
                <p>{m.desc}</p>
                <Link to="/mentors" className="btn-card">View Mentor</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Student Project Showcase</h2>
            <Link to="/showcase" className="view-all">View All →</Link>
          </div>
          <div className="grid-3">
            {showcaseProjects.map((p) => (
              <div className="card" key={p.name}>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <div className="tech-tags">
                  {p.tech.map((t) => <span className="tag" key={t}>{t}</span>)}
                </div>
                <div className="card-actions">
                  <a href={p.github} className="btn-card">GitHub</a>
                  <a href={p.demo} className="btn-card btn-card-outline">Demo</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Build Something Amazing?</h2>
          <p>Find your team, share your ideas, learn from mentors, and turn your innovation into reality.</p>
          <div className="hero-btns">
            <Link to="/find-teammates" className="btn-primary">Find Teammates</Link>
            <Link to="/register" className="btn-outline btn-outline-light">Join Campus Innovation Hub</Link>
          </div>
        </div>
      </section>

    </main>
  )
}
