import projects from './projects';
import socialLinks from './socialLinks';

export const PORTFOLIO_CONTENT_KEY = 'portfolio-content';

export const DEFAULT_PORTFOLIO_CONTENT = {
  name: 'Charles Restan G. Lambuson',
  role: 'BSIT STUDENT | ASPIRING FULL-STACK DEVELOPER',
  intro:
    'Turning ideas into digital experiences through code, creativity, and continuous learning.',
  aboutRole: 'BSIT Student & Aspiring Developer',
  aboutBio:
    "I am a Bachelor of Science in Information Technology student with a passion for programming and web development.\n\nI enjoy exploring different technologies, learning new programming languages, and building projects that solve real-world problems.\n\nMy goal is to continuously improve my development skills and become a professional software developer.",
  profileImage: '/images/charles-profile.png',
  idCard: {
    profileImage: '/images/charles-profile.png',
    organization: 'COMPANY NAME',
    tagline: 'TAGLINE GOES HERE',
    idNumber: 'DEV-2024-001',
    bloodType: 'AB',
    email: 'charleslambuson@gmail.com',
    phone: 'Philippines',
    website: 'WWW.YOURWEBSITE.COM',
    joinedDate: 'MM/DD/YEAR',
    expireDate: 'MM/DD/YEAR',
    employeeId: '00-0000',
    backNotes:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet.\n\nLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod.',
  },
  socialLinks,
  projects,
};

const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const stringOrDefault = (value, fallback) => typeof value === 'string' ? value : fallback;

function normalizeSocialLinks(value) {
  const links = Array.isArray(value) ? value.filter(isRecord) : copyPortfolioContent().socialLinks;
  return links.map((link) => ({
    ...link,
    name: stringOrDefault(link.name, ''),
    url: stringOrDefault(link.url, ''),
    icon: ['Github', 'Facebook', 'Linkedin', 'Instagram', 'Mail'].includes(link.icon)
      ? link.icon
      : 'Mail',
  }));
}

function normalizeProjects(value) {
  const items = Array.isArray(value) ? value.filter(isRecord) : copyPortfolioContent().projects;
  return items.map((project, index) => ({
    ...project,
    id: project.id ?? index + 1,
    title: stringOrDefault(project.title, ''),
    subtitle: stringOrDefault(project.subtitle, ''),
    description: stringOrDefault(project.description, ''),
    longDescription: stringOrDefault(project.longDescription, ''),
    category: stringOrDefault(project.category, 'fullstack'),
    image: stringOrDefault(project.image, ''),
    liveUrl: stringOrDefault(project.liveUrl, '#'),
    sourceUrl: stringOrDefault(project.sourceUrl, '#'),
    technologies: Array.isArray(project.technologies) ? project.technologies : [],
    highlights: Array.isArray(project.highlights) ? project.highlights : [],
    architecture: Array.isArray(project.architecture) ? project.architecture : [],
  }));
}

function normalizeIdCard(value) {
  const saved = isRecord(value) ? value : {};
  return Object.fromEntries(
    Object.entries(DEFAULT_PORTFOLIO_CONTENT.idCard).map(([field, fallback]) => [
      field,
      stringOrDefault(saved[field], fallback),
    ])
  );
}

export function copyPortfolioContent(content = DEFAULT_PORTFOLIO_CONTENT) {
  return JSON.parse(JSON.stringify(content));
}

export function loadPortfolioContent() {
  try {
    const stored = window.localStorage.getItem(PORTFOLIO_CONTENT_KEY);
    if (!stored) return copyPortfolioContent();

    const parsed = JSON.parse(stored);
    if (!isRecord(parsed)) throw new Error('Saved portfolio content must be an object.');

    return {
      ...copyPortfolioContent(),
      ...parsed,
      name: stringOrDefault(parsed.name, DEFAULT_PORTFOLIO_CONTENT.name),
      role: stringOrDefault(parsed.role, DEFAULT_PORTFOLIO_CONTENT.role),
      intro: stringOrDefault(parsed.intro, DEFAULT_PORTFOLIO_CONTENT.intro),
      aboutRole: stringOrDefault(parsed.aboutRole, DEFAULT_PORTFOLIO_CONTENT.aboutRole),
      aboutBio: stringOrDefault(parsed.aboutBio, DEFAULT_PORTFOLIO_CONTENT.aboutBio),
      profileImage: stringOrDefault(parsed.profileImage, DEFAULT_PORTFOLIO_CONTENT.profileImage),
      idCard: normalizeIdCard(parsed.idCard),
      socialLinks: normalizeSocialLinks(parsed.socialLinks),
      projects: normalizeProjects(parsed.projects),
    };
  } catch (error) {
    console.error('Unable to load saved portfolio content:', error);
    return copyPortfolioContent();
  }
}
