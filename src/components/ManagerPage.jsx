import { useState } from 'react';
import { ArrowLeft, Plus, Save, Trash2, RotateCcw } from 'lucide-react';
import {
  copyPortfolioContent,
  DEFAULT_PORTFOLIO_CONTENT,
} from '../data/portfolioContent';

const socialIcons = ['Github', 'Facebook', 'Linkedin', 'Instagram', 'Mail'];
const panelStyle = {
  background: 'var(--theme-surface)',
  border: '1px solid rgba(var(--theme-accent-rgb), 0.3)',
  borderRadius: '24px',
  padding: 'clamp(20px, 4vw, 32px)',
  boxShadow: 'var(--clay-shadow-soft)',
};
const inputStyle = {
  width: '100%',
  border: '1px solid rgba(var(--theme-accent-rgb), 0.45)',
  borderRadius: '12px',
  background: 'var(--theme-bg)',
  color: 'var(--text-primary)',
  padding: '11px 13px',
  outlineColor: 'var(--accent)',
};
const labelStyle = {
  display: 'block',
  color: 'var(--text-primary)',
  fontWeight: 700,
  fontSize: '0.9rem',
  marginBottom: '6px',
};

function isSafeUrl(value, allowRelative = false) {
  const url = value.trim();
  if (!url) return true;
  if (allowRelative && (url.startsWith('/') || url.startsWith('#'))) return true;
  return /^(https?:\/\/|mailto:|tel:)/i.test(url);
}

function EditorField({ label, help, children }) {
  return (
    <label style={{ display: 'block', minWidth: 0 }}>
      <span style={labelStyle}>{label}</span>
      {children}
      {help && (
        <span
          style={{
            display: 'block',
            color: 'var(--text-secondary)',
            fontSize: '0.78rem',
            marginTop: '5px',
          }}
        >
          {help}
        </span>
      )}
    </label>
  );
}

function TextInput({ label, help, ...props }) {
  return (
    <EditorField label={label} help={help}>
      <input {...props} style={{ ...inputStyle, ...props.style }} />
    </EditorField>
  );
}

function TextArea({ label, help, ...props }) {
  return (
    <EditorField label={label} help={help}>
      <textarea
        {...props}
        style={{
          ...inputStyle,
          minHeight: props.rows ? undefined : '110px',
          resize: 'vertical',
          ...props.style,
        }}
      />
    </EditorField>
  );
}

export default function ManagerPage({ content, onSave }) {
  const [draft, setDraft] = useState(() => copyPortfolioContent(content));
  const [notice, setNotice] = useState('');
  const [noticeIsError, setNoticeIsError] = useState(false);

  const updateField = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setNotice('');
  };

  const updateSocial = (index, field, value) => {
    setDraft((current) => ({
      ...current,
      socialLinks: current.socialLinks.map((link, linkIndex) =>
        linkIndex === index ? { ...link, [field]: value } : link
      ),
    }));
    setNotice('');
  };

  const updateProject = (index, field, value) => {
    setDraft((current) => ({
      ...current,
      projects: current.projects.map((project, projectIndex) =>
        projectIndex === index ? { ...project, [field]: value } : project
      ),
    }));
    setNotice('');
  };

  const updateIdCard = (field, value) => {
    setDraft((current) => ({
      ...current,
      idCard: { ...current.idCard, [field]: value },
    }));
    setNotice('');
  };

  const addSocial = () => {
    setDraft((current) => ({
      ...current,
      socialLinks: [
        ...current.socialLinks,
        { name: '', url: '', icon: 'Github' },
      ],
    }));
    setNotice('');
  };

  const addProject = () => {
    setDraft((current) => ({
      ...current,
      projects: [
        ...current.projects,
        {
          id: Date.now(),
          title: '',
          subtitle: '',
          description: '',
          longDescription: '',
          technologies: [],
          category: 'fullstack',
          image: '',
          liveUrl: '#',
          sourceUrl: '#',
          featured: true,
          highlights: [],
          architecture: [],
        },
      ],
    }));
    setNotice('');
  };

  const removeItem = (field, index) => {
    setDraft((current) => ({
      ...current,
      [field]: current[field].filter((_, itemIndex) => itemIndex !== index),
    }));
    setNotice('');
  };

  const handleSave = (event) => {
    event.preventDefault();

    if (!draft.name.trim() || !draft.profileImage.trim()) {
      setNotice('Add a display name and profile image before saving.');
      setNoticeIsError(true);
      return;
    }

    const socials = draft.socialLinks.filter(
      (link) => link.name.trim() || link.url.trim()
    );
    if (socials.some((link) => !link.name.trim() || !link.url.trim())) {
      setNotice('Complete or remove each social link before saving.');
      setNoticeIsError(true);
      return;
    }
    if (socials.some((link) => !isSafeUrl(link.url))) {
      setNotice('Social links must use http, https, mailto, or tel URLs.');
      setNoticeIsError(true);
      return;
    }
    if (draft.projects.some((project) => !project.title.trim())) {
      setNotice('Every project needs a title, or remove the empty project.');
      setNoticeIsError(true);
      return;
    }
    if (
      draft.projects.some(
        (project) =>
          !isSafeUrl(project.image, true) ||
          !isSafeUrl(project.liveUrl, true) ||
          !isSafeUrl(project.sourceUrl, true)
      ) ||
      !isSafeUrl(draft.profileImage, true) ||
      !isSafeUrl(draft.idCard.profileImage, true)
    ) {
      setNotice('Images and project links must use a web URL or a local path.');
      setNoticeIsError(true);
      return;
    }

    const updatedContent = {
      ...draft,
      name: draft.name.trim(),
      role: draft.role.trim(),
      intro: draft.intro.trim(),
      aboutRole: draft.aboutRole.trim(),
      aboutBio: draft.aboutBio.trim(),
      profileImage: draft.profileImage.trim(),
      idCard: Object.fromEntries(
        Object.entries(draft.idCard).map(([field, value]) => [field, value.trim()])
      ),
      socialLinks: socials.map((link) => ({
        ...link,
        name: link.name.trim(),
        url: link.url.trim(),
      })),
      projects: draft.projects.map((project) => ({
        ...project,
        title: project.title.trim(),
        subtitle: project.subtitle.trim(),
        description: project.description.trim(),
        longDescription: project.longDescription.trim() || project.description.trim(),
        image: project.image.trim(),
        liveUrl: project.liveUrl.trim() || '#',
        sourceUrl: project.sourceUrl.trim() || '#',
      })),
    };

    try {
      onSave(updatedContent);
      setDraft(copyPortfolioContent(updatedContent));
      setNotice('Saved on this browser. Open the portfolio to see your changes.');
      setNoticeIsError(false);
    } catch (error) {
      console.error('Unable to save portfolio content:', error);
      setNotice('Could not save your changes. Check browser storage and try again.');
      setNoticeIsError(true);
    }
  };

  const resetDraft = () => {
    setDraft(copyPortfolioContent(DEFAULT_PORTFOLIO_CONTENT));
    setNotice('Starter content loaded. Save to apply it on this browser.');
    setNoticeIsError(false);
  };

  const restoreSaved = () => {
    setDraft(copyPortfolioContent(content));
    setNotice('Unsaved edits discarded.');
    setNoticeIsError(false);
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: 'clamp(20px, 5vw, 56px) 18px',
        background:
          'linear-gradient(180deg, var(--cloud) 0%, var(--theme-soft) 100%)',
        color: 'var(--text-primary)',
      }}
    >
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '28px',
          }}
        >
          <div>
            <p
              style={{
                color: 'var(--accent-dark)',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                marginBottom: '5px',
              }}
            >
              Portfolio manager
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
                lineHeight: 1.15,
              }}
            >
              Edit your portfolio
            </h1>
          </div>
          <a
            href="/"
            className="btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <ArrowLeft size={17} />
            View portfolio
          </a>
        </header>

        <div
          role="note"
          style={{
            ...panelStyle,
            marginBottom: '22px',
            color: 'var(--text-secondary)',
            fontSize: '0.92rem',
            lineHeight: 1.6,
          }}
        >
          Edits are saved in this browser only. They appear on this device and
          browser, but are not published for other visitors. Use an image URL or
          a path such as <code>/images/profile.jpg</code>.
        </div>

        <form onSubmit={handleSave} style={{ display: 'grid', gap: '22px' }}>
          <section style={panelStyle}>
            <h2 style={sectionHeadingStyle}>Profile and introduction</h2>
            <div style={fieldGridStyle}>
              <TextInput
                label="Display name"
                value={draft.name}
                onChange={(event) => updateField('name', event.target.value)}
              />
              <TextInput
                label="Role / headline"
                value={draft.role}
                onChange={(event) => updateField('role', event.target.value)}
              />
              <TextInput
                label="About-card subtitle"
                value={draft.aboutRole}
                onChange={(event) => updateField('aboutRole', event.target.value)}
              />
              <TextInput
                label="Profile image URL or path"
                help="Example: /images/profile.jpg or https://example.com/photo.jpg"
                value={draft.profileImage}
                onChange={(event) => updateField('profileImage', event.target.value)}
              />
              {draft.profileImage && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <EditorField label="Profile image preview">
                    <img
                      src={draft.profileImage}
                      alt="Profile preview"
                      style={{
                        width: '96px',
                        height: '96px',
                        objectFit: 'cover',
                        borderRadius: '18px',
                        border: '2px solid var(--accent)',
                      }}
                    />
                  </EditorField>
                </div>
              )}
              <TextArea
                label="Short introduction"
                rows={3}
                value={draft.intro}
                onChange={(event) => updateField('intro', event.target.value)}
              />
              <TextArea
                label="About text"
                help="Separate paragraphs with a blank line."
                rows={7}
                value={draft.aboutBio}
                onChange={(event) => updateField('aboutBio', event.target.value)}
              />
            </div>
          </section>

          <section style={panelStyle}>
            <h2 style={sectionHeadingStyle}>3D ID card</h2>
            <div style={fieldGridStyle}>
              <TextInput
                label="ID profile image URL or path"
                help="Leave blank to use the main profile image."
                value={draft.idCard.profileImage}
                onChange={(event) =>
                  updateIdCard('profileImage', event.target.value)
                }
              />
              {draft.idCard.profileImage && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <EditorField label="ID photo preview">
                    <img
                      src={draft.idCard.profileImage}
                      alt="ID profile preview"
                      style={{
                        width: '96px',
                        height: '96px',
                        objectFit: 'cover',
                        borderRadius: '14px',
                        border: '2px solid var(--accent)',
                      }}
                    />
                  </EditorField>
                </div>
              )}
              {[
                ['organization', 'Organization name'],
                ['tagline', 'Tagline'],
                ['idNumber', 'ID number'],
                ['bloodType', 'Blood type'],
                ['email', 'Email'],
                ['phone', 'Phone / location'],
                ['website', 'Website footer text'],
                ['joinedDate', 'Joined date'],
                ['expireDate', 'Expiration date'],
                ['employeeId', 'Employee ID'],
              ].map(([field, label]) => (
                <TextInput
                  key={field}
                  label={label}
                  value={draft.idCard[field]}
                  onChange={(event) => updateIdCard(field, event.target.value)}
                />
              ))}
              <TextArea
                label="Back-of-card notes"
                help="Separate lines with a blank line; each paragraph appears on the card."
                rows={4}
                value={draft.idCard.backNotes}
                onChange={(event) =>
                  updateIdCard('backNotes', event.target.value)
                }
              />
            </div>
          </section>

          <section style={panelStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={sectionHeadingStyle}>Social links</h2>
              <button type="button" className="btn-outline" onClick={addSocial}>
                <Plus size={16} /> Add link
              </button>
            </div>
            <div style={{ display: 'grid', gap: '14px' }}>
              {draft.socialLinks.map((link, index) => (
                <div key={`${link.name}-${index}`} style={itemCardStyle}>
                  <TextInput
                    label="Label"
                    value={link.name}
                    onChange={(event) =>
                      updateSocial(index, 'name', event.target.value)
                    }
                  />
                  <TextInput
                    label="URL"
                    help="Use https://, mailto:, or tel:."
                    value={link.url}
                    onChange={(event) =>
                      updateSocial(index, 'url', event.target.value)
                    }
                  />
                  <EditorField label="Icon">
                    <select
                      value={socialIcons.includes(link.icon) ? link.icon : 'Mail'}
                      onChange={(event) =>
                        updateSocial(index, 'icon', event.target.value)
                      }
                      style={inputStyle}
                    >
                      {socialIcons.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </EditorField>
                  <button
                    type="button"
                    className="manager-remove-button"
                    aria-label={`Remove ${link.name || 'social link'}`}
                    onClick={() => removeItem('socialLinks', index)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
              {draft.socialLinks.length === 0 && (
                <p style={emptyTextStyle}>No social links yet. Add one above.</p>
              )}
            </div>
          </section>

          <section style={panelStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={sectionHeadingStyle}>Projects</h2>
              <button type="button" className="btn-outline" onClick={addProject}>
                <Plus size={16} /> Add project
              </button>
            </div>
            <div style={{ display: 'grid', gap: '18px' }}>
              {draft.projects.map((project, index) => (
                <article key={project.id ?? index} style={projectCardStyle}>
                  <div style={sectionHeaderStyle}>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>
                      {project.title || `Project ${index + 1}`}
                    </h3>
                    <button
                      type="button"
                      className="manager-remove-button"
                      aria-label={`Remove ${project.title || 'project'}`}
                      onClick={() => removeItem('projects', index)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                  <div style={fieldGridStyle}>
                    <TextInput
                      label="Title"
                      value={project.title}
                      onChange={(event) =>
                        updateProject(index, 'title', event.target.value)
                      }
                    />
                    <TextInput
                      label="Subtitle"
                      value={project.subtitle || ''}
                      onChange={(event) =>
                        updateProject(index, 'subtitle', event.target.value)
                      }
                    />
                    <TextInput
                      label="Image URL or path"
                      value={project.image || ''}
                      onChange={(event) =>
                        updateProject(index, 'image', event.target.value)
                      }
                    />
                    <TextInput
                      label="Live project URL"
                      value={project.liveUrl || ''}
                      onChange={(event) =>
                        updateProject(index, 'liveUrl', event.target.value)
                      }
                    />
                    <TextInput
                      label="Source / repository URL"
                      value={project.sourceUrl || ''}
                      onChange={(event) =>
                        updateProject(index, 'sourceUrl', event.target.value)
                      }
                    />
                    <EditorField label="Category">
                      <select
                        value={project.category || 'fullstack'}
                        onChange={(event) =>
                          updateProject(index, 'category', event.target.value)
                        }
                        style={inputStyle}
                      >
                        <option value="fullstack">Full-Stack</option>
                        <option value="networking">Networking</option>
                      </select>
                    </EditorField>
                    <TextArea
                      label="Description"
                      rows={4}
                      value={project.description || ''}
                      onChange={(event) =>
                        updateProject(index, 'description', event.target.value)
                      }
                    />
                    <TextArea
                      label="Detailed description"
                      rows={4}
                      value={project.longDescription || ''}
                      onChange={(event) =>
                        updateProject(index, 'longDescription', event.target.value)
                      }
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div
            style={{
              ...panelStyle,
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button type="submit" className="btn-primary">
              <Save size={17} /> Save changes
            </button>
            <button type="button" className="btn-outline" onClick={restoreSaved}>
              Discard unsaved edits
            </button>
            <button type="button" className="btn-outline" onClick={resetDraft}>
              <RotateCcw size={16} /> Load starter content
            </button>
            {notice && (
              <p
                role="status"
                style={{
                  flexBasis: '100%',
                  margin: '4px 0 0',
                  color: noticeIsError ? '#C0392B' : 'var(--accent-dark)',
                  fontWeight: 600,
                }}
              >
                {notice}
              </p>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}

const sectionHeadingStyle = {
  margin: 0,
  fontFamily: 'var(--font-heading)',
  fontSize: '1.3rem',
};
const sectionHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  flexWrap: 'wrap',
  marginBottom: '18px',
};
const fieldGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
  gap: '16px',
};
const itemCardStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))',
  alignItems: 'end',
  gap: '12px',
  border: '1px solid rgba(var(--theme-accent-rgb), 0.2)',
  borderRadius: '16px',
  padding: '14px',
  background: 'var(--theme-bg)',
};
const projectCardStyle = {
  border: '1px solid rgba(var(--theme-accent-rgb), 0.25)',
  borderRadius: '18px',
  padding: '18px',
  background: 'var(--theme-bg)',
};
const emptyTextStyle = {
  color: 'var(--text-secondary)',
  margin: 0,
};
