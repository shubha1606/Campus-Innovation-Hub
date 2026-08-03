import { Link } from 'react-router-dom'
import './About.css'

const objectives = [
  { emoji: '🤝', title: 'Foster Collaboration', desc: 'Connect students across departments to build interdisciplinary teams and innovative solutions.' },
  { emoji: '💡', title: 'Spark Innovation', desc: 'Provide a space where ideas are shared freely, refined collaboratively, and turned into real projects.' },
  { emoji: '🏆', title: 'Enable Competition', desc: 'Help students discover and participate in hackathons, competitions, and innovation challenges.' },
  { emoji: '🧑‍🏫', title: 'Bridge Mentorship', desc: 'Connect students with experienced mentors from industry and academia for guided growth.' },
  { emoji: '🚀', title: 'Showcase Talent', desc: 'Give students a platform to present their completed projects to the wider campus community.' },
  { emoji: '🌐', title: 'Build Networks', desc: 'Help students grow their professional network within and beyond their college campus.' },
]

const features = [
  {
    emoji: '👥',
    title: 'Project Collaboration',
    desc: 'Find teammates based on skills, interests, and availability. Build diverse teams and work together on projects that matter.',
    color: '#4f6ef7',
  },
  {
    emoji: '🏆',
    title: 'Hackathons',
    desc: 'Discover upcoming hackathons, register your team, and track your participation history all in one place.',
    color: '#e94560',
  },
  {
    emoji: '🧑‍🏫',
    title: 'Mentorship',
    desc: 'Book one-on-one sessions with experienced mentors from top companies and research institutions.',
    color: '#10b981',
  },
  {
    emoji: '🚀',
    title: 'Innovation Showcase',
    desc: 'Present your completed projects with descriptions, tech stacks, GitHub links, and live demos.',
    color: '#f59e0b',
  },
]

const team = [
  { name: 'Priya Sharma', role: 'Project Lead & Full Stack Developer', dept: 'Computer Science, 4th Year', initial: 'P', color: '#e94560' },
  { name: 'Arjun Mehta', role: 'UI/UX Designer & Frontend Developer', dept: 'Information Technology, 3rd Year', initial: 'A', color: '#4f6ef7' },
  { name: 'Sneha Iyer', role: 'Backend Developer & Database Engineer', dept: 'Computer Science, 4th Year', initial: 'S', color: '#10b981' },
  { name: 'Rahul Das', role: 'DevOps & API Integration Engineer', dept: 'Electronics & Communication, 3rd Year', initial: 'R', color: '#f59e0b' },
]

const whyUs = [
  { emoji: '🎓', title: 'Built for Students', desc: 'Every feature is designed around the real needs of college students — from finding teammates to showcasing work.' },
  { emoji: '🔓', title: 'Free to Use', desc: 'Campus Innovation Hub is completely free for all registered students. No hidden fees, no premium tiers.' },
  { emoji: '🔒', title: 'Safe & Trusted', desc: 'Your data is secure. Only verified college students can register and access the platform.' },
  { emoji: '📱', title: 'Works Everywhere', desc: 'Fully responsive design that works seamlessly on desktop, tablet, and mobile devices.' },
]

export default function About() {
  return (
    <main className="about-page">

      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-hero-badge">About Us</span>
          <h1>About Campus Innovation Hub</h1>
          <p>We are a student-built platform dedicated to empowering college innovators — helping them connect, collaborate, and create solutions that matter.</p>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="about-section">
        <div className="about-container">
          <div className="mv-grid">
            <div className="mv-card mv-mission">
              <span className="mv-icon">🎯</span>
              <h2>Our Mission</h2>
              <p>To create a unified digital space where college students can discover like-minded peers, collaborate on innovative projects, access mentorship, and showcase their work — breaking down departmental silos and fostering a culture of innovation across campuses.</p>
            </div>
            <div className="mv-card mv-vision">
              <span className="mv-icon">🔭</span>
              <h2>Our Vision</h2>
              <p>To become the go-to innovation platform for every college student in India — where the next generation of entrepreneurs, engineers, and changemakers take their first steps toward building impactful solutions for the real world.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Objectives ── */}
      <section className="about-section about-section-alt">
        <div className="about-container">
          <h2 className="about-section-title">Our Objectives</h2>
          <div className="about-grid-3">
            {objectives.map((o) => (
              <div className="about-obj-card" key={o.title}>
                <span className="about-obj-emoji">{o.emoji}</span>
                <h3>{o.title}</h3>
                <p>{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="about-section">
        <div className="about-container">
          <h2 className="about-section-title">What We Offer</h2>
          <div className="about-grid-2">
            {features.map((f) => (
              <div className="about-feature-card" key={f.title}>
                <div className="about-feature-icon" style={{ background: `${f.color}18`, color: f.color }}>
                  {f.emoji}
                </div>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="about-section about-section-alt">
        <div className="about-container">
          <h2 className="about-section-title">Meet the Team</h2>
          <p className="about-section-sub">Campus Innovation Hub was built by a passionate team of students who wanted to solve a real problem they faced every day.</p>
          <div className="about-grid-4">
            {team.map((m) => (
              <div className="about-team-card" key={m.name}>
                <div className="about-team-avatar" style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}99)` }}>
                  {m.initial}
                </div>
                <h3>{m.name}</h3>
                <p className="about-team-role">{m.role}</p>
                <p className="about-team-dept">{m.dept}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="about-section">
        <div className="about-container">
          <h2 className="about-section-title">Why Choose Us</h2>
          <div className="about-grid-2">
            {whyUs.map((w) => (
              <div className="about-why-card" key={w.title}>
                <span className="about-why-emoji">{w.emoji}</span>
                <div>
                  <h3>{w.title}</h3>
                  <p>{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta">
        <div className="about-container">
          <h2>Ready to Join the Community?</h2>
          <p>Connect with innovators, find your team, and start building something amazing today.</p>
          <div className="about-cta-btns">
            <Link to="/register" className="about-btn-primary">🚀 Join Now</Link>
            <Link to="/projects" className="about-btn-outline">Explore Projects</Link>
          </div>
        </div>
      </section>

    </main>
  )
}
