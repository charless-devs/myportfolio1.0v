import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import { GithubIcon, FacebookIcon, LinkedinIcon, InstagramIcon } from './Icons';
import defaultSocialLinks from '../data/socialLinks';
import CloudBackdrop from './CloudBackdrop';

const iconMap = {
  Github: GithubIcon,
  Facebook: FacebookIcon,
  Linkedin: LinkedinIcon,
  Instagram: InstagramIcon,
  Mail: Mail,
};

const DEFAULT_EMAIL = 'charleslambuson@gmail.com';

const validators = {
  name: (v) => (v.trim().length >= 2 ? null : 'Please enter your name (2+ characters).'),
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
      ? null
      : 'Please enter a valid email address.',
  subject: (v) => (v.trim().length >= 3 ? null : 'Please add a short subject (3+ characters).'),
  message: (v) =>
    v.trim().length >= 10
      ? null
      : 'Please write at least 10 characters so I can help.',
};

export default function Contact({
  socialLinks = defaultSocialLinks,
  name = 'Charles',
}) {
  const emailAddress =
    socialLinks
      .find(
        (social) =>
          social.icon === 'Mail' &&
          typeof social.url === 'string' &&
          social.url.startsWith('mailto:')
      )
      ?.url.slice('mailto:'.length) || DEFAULT_EMAIL;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null,
  });
  const [copied, setCopied] = useState(false);

  const errorFor = (field) =>
    touched[field] ? validators[field](formData[field]) : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status.error) setStatus((prev) => ({ ...prev, error: null }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
    } catch {
      // Fallback for browsers without clipboard permissions
      const ta = document.createElement('textarea');
      ta.value = emailAddress;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [emailAddress]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate every field, marking all as touched
    const errors = Object.keys(validators).map((k) => validators[k](formData[k]));
    setTouched({ name: true, email: true, subject: true, message: true });

    if (errors.some(Boolean)) {
      setStatus({
        submitting: false,
        submitted: false,
        error: 'Please fix the highlighted fields and try again.',
      });
      return;
    }

    setStatus({ submitting: true, submitted: false, error: null });

    // Keep the form genuinely usable without requiring an unconfigured API:
    // validation passes, then the visitor's mail client receives a prefilled draft.
    const subject = encodeURIComponent(`[Portfolio] ${formData.subject}`);
    const body = encodeURIComponent(
      `Hi ${name},\n\n${formData.message}\n\nBest,\n${formData.name}\n${formData.email}`
    );
    window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
    setStatus({ submitting: false, submitted: true, error: null });
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTouched({});
  };

  const fields = [
    { name: 'name', label: 'Your Name *', type: 'text', placeholder: 'e.g. John Doe' },
    { name: 'email', label: 'Your Email *', type: 'email', placeholder: 'name@example.com' },
    { name: 'subject', label: 'Subject *', type: 'text', placeholder: 'Project Collaboration / Opportunity' },
  ];

  return (
    <section
      id="contact"
      style={{
        position: 'relative',
        padding: '120px 24px',
        background:
          'linear-gradient(180deg, var(--white) 0%, var(--cloud) 40%, var(--sky-soft) 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Three.js soft-clay floating clouds backdrop */}
      <CloudBackdrop />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-eyebrow">START A CONVERSATION</span>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: 'var(--navy)',
                textTransform: 'uppercase',
                margin: '8px 0 16px 0',
              }}
            >
              LET&apos;S CONNECT
            </h2>
            <div className="section-divider" style={{ margin: '0 auto' }} />
          </motion.div>
        </div>

        {/* Large white clay container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          style={{
            backgroundColor: 'var(--white)',
            borderRadius: '36px',
            padding: 'clamp(28px, 5vw, 56px)',
            border: '1px solid rgba(var(--theme-surface-rgb), 0.95)',
            boxShadow:
              '0 44px 90px -36px rgba(var(--theme-primary-rgb), 0.45), inset 0 4px 8px rgba(var(--theme-surface-rgb), 1), inset 0 -10px 24px rgba(var(--theme-primary-rgb), 0.07)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Direct Info & Socials */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '26px',
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 'clamp(1.4rem, 2.6vw, 1.8rem)',
                    fontWeight: 700,
                    color: 'var(--navy)',
                    margin: '0 0 12px 0',
                    letterSpacing: '0.02em',
                  }}
                >
                  Let&apos;s Build Something{' '}
                  <span style={{ color: 'var(--deep-blue)' }}>Extraordinary</span>
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '1rem',
                    lineHeight: 1.75,
                    color: 'var(--text-secondary)',
                    margin: 0,
                    maxWidth: 'none',
                  }}
                >
                  Whether you have an inquiry, an idea for collaboration, or
                  simply want to talk about technology, feel free to reach out.
                  I look forward to connecting!
                </p>
              </div>

              {/* Email + location clay card with copy-to-clipboard */}
              <div
                style={{
                  backgroundColor: 'var(--cloud)',
                  borderRadius: '26px',
                  padding: '26px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                  border: '1px solid rgba(var(--theme-surface-rgb), 0.95)',
                  boxShadow:
                    'inset 0 3px 8px rgba(var(--theme-primary-rgb), 0.12), inset 0 -3px 6px rgba(var(--theme-surface-rgb), 0.9)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '16px',
                      background:
                        'linear-gradient(160deg, var(--white) 0%, var(--sky-soft) 100%)',
                      boxShadow:
                        '0 10px 20px -12px rgba(var(--theme-primary-rgb), 0.4), inset 0 3px 6px rgba(var(--theme-surface-rgb), 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Mail size={20} color="var(--deep-blue)" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        color: 'var(--text-secondary)',
                        display: 'block',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontWeight: 600,
                      }}
                    >
                      Email
                    </span>
                    <a
                      href={`mailto:${emailAddress}`}
                      style={{
                        color: 'var(--navy)',
                        textDecoration: 'none',
                        fontWeight: 700,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.95rem',
                        wordBreak: 'break-all',
                      }}
                    >
                      {emailAddress}
                    </a>
                  </div>
                </div>

                {/* Copy to clipboard button */}
                <button
                  onClick={copyEmail}
                  className={copied ? 'btn-primary' : 'btn-outline'}
                  style={{
                    width: '100%',
                    fontSize: '0.88rem',
                    padding: '12px 18px',
                  }}
                  aria-live="polite"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied to clipboard!' : 'Copy email address'}</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '16px',
                      background:
                        'linear-gradient(160deg, var(--white) 0%, var(--sky-soft) 100%)',
                      boxShadow:
                        '0 10px 20px -12px rgba(var(--theme-primary-rgb), 0.4), inset 0 3px 6px rgba(var(--theme-surface-rgb), 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={20} color="var(--deep-blue)" />
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        color: 'var(--text-secondary)',
                        display: 'block',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontWeight: 600,
                      }}
                    >
                      Location / Degree
                    </span>
                    <span
                      style={{
                        color: 'var(--navy)',
                        fontWeight: 700,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.95rem',
                      }}
                    >
                      BSIT Student, Philippines
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div>
                <span
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    color: 'var(--deep-blue)',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '14px',
                  }}
                >
                  CONNECT ON SOCIAL PLATFORMS
                </span>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  {socialLinks.map((social) => {
                    const Icon = iconMap[social.icon] || Mail;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="clay-pill"
                        style={{
                          padding: '11px 20px',
                          fontSize: '0.85rem',
                          textDecoration: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <Icon size={16} color="var(--deep-blue)" />
                        <span>{social.name}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              style={{
                backgroundColor: 'var(--white)',
                borderRadius: '30px',
                padding: 'clamp(24px, 4vw, 38px)',
                border: '1px solid rgba(var(--theme-surface-rgb), 0.95)',
                boxShadow:
                  '0 30px 64px -30px rgba(var(--theme-primary-rgb), 0.42), inset 0 3px 6px rgba(var(--theme-surface-rgb), 1), inset 0 -8px 20px rgba(var(--theme-primary-rgb), 0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
              }}
            >
              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: 'var(--navy)',
                  margin: '0 0 4px 0',
                }}
              >
                Send a Message
              </h3>

              {status.error && (
                <div
                  role="alert"
                  style={{
                    backgroundColor: '#FFF1F1',
                    border: '1px solid rgba(255, 160, 160, 0.7)',
                    borderRadius: '16px',
                    padding: '13px 17px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#B4453F',
                    fontSize: '0.87rem',
                    fontFamily: "'Inter', sans-serif",
                    boxShadow: 'inset 0 2px 6px rgba(180, 69, 63, 0.1)',
                  }}
                >
                  <AlertCircle size={18} />
                  <span>{status.error}</span>
                </div>
              )}

              {status.submitted && (
                <div
                  role="status"
                  style={{
                    backgroundColor: '#EAF9F1',
                    border: '1px solid rgba(120, 210, 165, 0.7)',
                    borderRadius: '16px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#1F8A55',
                    fontSize: '0.9rem',
                    fontFamily: "'Inter', sans-serif",
                    boxShadow: 'inset 0 2px 6px rgba(31, 138, 85, 0.12)',
                  }}
                >
                  <CheckCircle2 size={20} />
                  <span>Your email draft is ready to send. Thank you for reaching out!</span>
                </div>
              )}

              {fields.map((f) => {
                const err = errorFor(f.name);
                const valid = touched[f.name] && !err && formData[f.name].trim();
                return (
                  <div key={f.name}>
                    <label
                      htmlFor={`contact-${f.name}`}
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        color: 'var(--navy)',
                        display: 'block',
                        marginBottom: '7px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {f.label}
                    </label>
                    <input
                      id={`contact-${f.name}`}
                      type={f.type}
                      name={f.name}
                      value={formData[f.name]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={f.placeholder}
                      required
                      aria-invalid={err ? 'true' : 'false'}
                      className={`clay-input${err ? ' invalid' : valid ? ' valid' : ''}`}
                    />
                    {err && (
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginTop: '7px',
                          fontSize: '0.78rem',
                          color: '#B4453F',
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        <AlertCircle size={13} />
                        {err}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Message Field */}
              <div>
                <label
                  htmlFor="contact-message"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: 'var(--navy)',
                    display: 'block',
                    marginBottom: '7px',
                    textTransform: 'uppercase',
                  }}
                >
                  Your Message *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Write your message here..."
                  required
                  aria-invalid={errorFor('message') ? 'true' : 'false'}
                  className={`clay-input${errorFor('message') ? ' invalid' : ''}`}
                  style={{ resize: 'vertical', minHeight: '120px' }}
                />
                {errorFor('message') && (
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '7px',
                      fontSize: '0.78rem',
                      color: '#B4453F',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <AlertCircle size={13} />
                    {errorFor('message')}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status.submitting}
                className="btn-primary"
                style={{
                  padding: '15px 28px',
                  fontSize: '0.95rem',
                  width: '100%',
                  marginTop: '6px',
                  cursor: status.submitting ? 'wait' : 'pointer',
                  opacity: status.submitting ? 0.7 : 1,
                }}
              >
                {status.submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
