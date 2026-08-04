import { useState } from 'react'
import './Contact.css'

const contactInfo = [
  { emoji: '📧', label: 'Email', value: 'support@campusinnovationhub.in', sub: 'We reply within 24 hours' },
  { emoji: '📞', label: 'Phone', value: '+91 98765 43210', sub: 'Mon – Fri, 9 AM – 6 PM' },
  { emoji: '📍', label: 'Address', value: 'Innovation Block, NIT Campus, Trichy – 620015, Tamil Nadu', sub: 'India' },
  { emoji: '🕐', label: 'Working Hours', value: 'Mon – Fri: 9 AM – 6 PM', sub: 'Sat: 10 AM – 2 PM' },
]

const faqs = [
  {
    q: 'Who can register on Campus Innovation Hub?',
    a: 'Any currently enrolled college student can register. You will need a valid college email address to create an account.',
  },
  {
    q: 'Is Campus Innovation Hub free to use?',
    a: 'Yes, the platform is completely free for all registered students. There are no hidden charges or premium tiers.',
  },
  {
    q: 'How do I find teammates for my project?',
    a: 'Use the "Find Teammates" feature to search for students by skills, department, year, and interests. You can send collaboration requests directly from their profile.',
  },
  {
    q: 'Can I showcase a project that is still in progress?',
    a: 'Absolutely. You can list your project with an "Active" or "In Progress" status and update it as you make progress. Other students can discover it and request to join.',
  },
  {
    q: 'How do I book a session with a mentor?',
    a: 'Visit the Mentors page, browse available mentors by expertise, and click "Book Session" on their profile. You can choose a time slot that works for both of you.',
  },
  {
    q: 'How do I report a bug or suggest a feature?',
    a: 'Use the contact form on this page or email us directly at support@campusinnovationhub.in. We review all feedback and prioritise improvements based on community input.',
  },
]

const EMPTY = { name: '', email: '', subject: '', message: '' }

function validate(form) {
  const errors = {}
  if (!form.name.trim())    errors.name    = 'Full name is required.'
  if (!form.email.trim())   errors.email   = 'Email address is required.'
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Enter a valid email address.'
  if (!form.subject.trim()) errors.subject = 'Subject is required.'
  if (!form.message.trim()) errors.message = 'Message cannot be empty.'
  return errors
}

export default function Contact() {
  const [form, setForm]     = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [sent, setSent]     = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    // API call will be added later
    console.log('Contact form submitted:', form)
    setSent(true)
  }

  function handleReset() {
    setForm(EMPTY)
    setErrors({})
    setSent(false)
  }

  function toggleFaq(i) {
    setOpenFaq(openFaq === i ? null : i)
  }

  return (
    <main className="contact-page">

      {/* ── Hero ── */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <span className="contact-badge">Get in Touch</span>
          <h1>Contact Us</h1>
          <p>Have a question, suggestion, or just want to say hello? We'd love to hear from you.</p>
        </div>
      </section>

      {/* ── Info Cards ── */}
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-info-grid">
            {contactInfo.map((c) => (
              <div className="contact-info-card" key={c.label}>
                <span className="contact-info-emoji">{c.emoji}</span>
                <h3>{c.label}</h3>
                <p className="contact-info-value">{c.value}</p>
                <p className="contact-info-sub">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + Map ── */}
      <section className="contact-section contact-section-alt">
        <div className="contact-container">
          <div className="contact-main-grid">

            {/* Form */}
            <div className="contact-form-wrap">
              <h2>Send Us a Message</h2>
              <p className="contact-form-sub">Fill in the form below and we'll get back to you as soon as possible.</p>

              {sent ? (
                <div className="contact-success">
                  <span>🎉</span>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button className="contact-btn-primary" onClick={handleReset}>Send Another Message</button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="contact-row">
                    <div className={`contact-field ${errors.name ? 'contact-field-error' : ''}`}>
                      <label htmlFor="name">Full Name <span className="contact-req">*</span></label>
                      <input id="name" name="name" type="text" placeholder="Your full name" value={form.name} onChange={handleChange} />
                      {errors.name && <span className="contact-error">{errors.name}</span>}
                    </div>
                    <div className={`contact-field ${errors.email ? 'contact-field-error' : ''}`}>
                      <label htmlFor="email">Email Address <span className="contact-req">*</span></label>
                      <input id="email" name="email" type="email" placeholder="you@college.edu" value={form.email} onChange={handleChange} />
                      {errors.email && <span className="contact-error">{errors.email}</span>}
                    </div>
                  </div>

                  <div className={`contact-field ${errors.subject ? 'contact-field-error' : ''}`}>
                    <label htmlFor="subject">Subject <span className="contact-req">*</span></label>
                    <input id="subject" name="subject" type="text" placeholder="What is this about?" value={form.subject} onChange={handleChange} />
                    {errors.subject && <span className="contact-error">{errors.subject}</span>}
                  </div>

                  <div className={`contact-field ${errors.message ? 'contact-field-error' : ''}`}>
                    <label htmlFor="message">Message <span className="contact-req">*</span></label>
                    <textarea id="message" name="message" rows={5} placeholder="Write your message here..." value={form.message} onChange={handleChange} />
                    {errors.message && <span className="contact-error">{errors.message}</span>}
                  </div>

                  <button type="submit" className="contact-btn-primary">📨 Send Message</button>
                </form>
              )}
            </div>

            {/* Map placeholder */}
            <div className="contact-map-wrap">
              <h2>Find Us</h2>
              <p className="contact-form-sub">Visit us at the Innovation Block on the NIT Campus.</p>
              <div className="contact-map-placeholder">
                <div className="contact-map-inner">
                  <span className="contact-map-pin">📍</span>
                  <p className="contact-map-label">NIT Campus, Trichy</p>
                  <p className="contact-map-sub">Tamil Nadu, India – 620015</p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="contact-map-link"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
              <div className="contact-map-details">
                <div className="contact-map-detail-item">
                  <span>🚌</span>
                  <p>Nearest Bus Stop: NIT Main Gate (5 min walk)</p>
                </div>
                <div className="contact-map-detail-item">
                  <span>🚉</span>
                  <p>Nearest Railway Station: Tiruchirappalli Junction (8 km)</p>
                </div>
                <div className="contact-map-detail-item">
                  <span>🅿️</span>
                  <p>Free parking available inside the campus</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="contact-section">
        <div className="contact-container">
          <h2 className="contact-section-title">Frequently Asked Questions</h2>
          <p className="contact-section-sub">Can't find what you're looking for? Send us a message using the form above.</p>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div
                className={`faq-item ${openFaq === i ? 'faq-open' : ''}`}
                key={i}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFaq(i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{faq.q}</span>
                  <span className="faq-icon">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
