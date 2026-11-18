const projects = [
  {
    id: 1,
    title: "QuizNova",
    subtitle: "Online Quiz & Assessment Platform",
    description:
      "A web-based quiz and assessment platform that lets students take timed online quizzes, answer questions, view their scores, and monitor learning progress — with a full administrative side for quiz, question, and results management.",
    longDescription:
      "QuizNova streamlines the entire assessment lifecycle: instructors author question banks with multiple question types, students sit timed sessions with autosave, and results are graded instantly with per-topic analytics. The architecture separates the grading engine from the delivery layer so question randomness and anti-cheat shuffling never touch stored data.",
    technologies: ["Node.js", "Express.js", "EJS", "MySQL", "JavaScript", "Bootstrap"],
    category: "fullstack",
    image: "/images/project-quiznova.png",
    liveUrl: "#",
    sourceUrl: "https://github.com/",
    featured: true,
    highlights: [
      "Role-based dashboards for instructors and students",
      "Timed sessions with server-side autosave and auto-submit",
      "Randomized question ordering per attempt",
      "Instant grading with per-topic performance breakdown",
      "Question bank CRUD with import-ready MySQL schema",
    ],
    architecture: [
      { label: "Client", detail: "Server-rendered EJS views + vanilla JS for the timer and quiz runner" },
      { label: "API / Services", detail: "Express routes; grading engine isolated as a pure module" },
      { layer: true, label: "Data", detail: "MySQL — users, quizzes, question banks, attempts, results" },
      { label: "Infra", detail: "XAMPP local stack, session-based auth, environment-scoped config" },
    ],
  },
  {
    id: 2,
    title: "DIDAS",
    subtitle: "Document & Data Archive System",
    description:
      "A document and data archive system designed to register, categorize, store, and retrieve institutional records efficiently — replacing manual filing with searchable, permission-aware digital archiving.",
    longDescription:
      "DIDAS gives organizations a single source of truth for records management. Documents are registered with metadata, routed through a status workflow, and retrieved through full-text and filter-based search. Access is scoped by role so sensitive records stay visible only to authorized staff, and every mutation is written to an audit trail.",
    technologies: ["PHP", "MySQL", "JavaScript", "HTML5", "CSS3", "Bootstrap"],
    category: "fullstack",
    image: "/images/project-didas.png",
    liveUrl: "#",
    sourceUrl: "https://github.com/",
    featured: true,
    highlights: [
      "Metadata-driven document registration and categorization",
      "Full-text search with status and category filters",
      "Role-scoped access control for sensitive records",
      "Status workflow: draft → under review → archived",
      "Audit trail of create, update, and download events",
    ],
    architecture: [
      { label: "Client", detail: "PHP-rendered responsive templates with filterable data tables" },
      { label: "API / Services", detail: "Controller layer handling search, workflow transitions, audit logging" },
      { label: "Data", detail: "MySQL — documents, metadata, roles, audit_log" },
      { label: "Infra", detail: "XAMPP / Apache, session auth, file storage with hashed names" },
    ],
  },
  {
    id: 3,
    title: "Auth & Admin System",
    subtitle: "Authentication & Administration Module",
    description:
      "A reusable authentication and admin system providing secure registration, login, session handling, role-based access control, and a user-management dashboard for downstream applications.",
    longDescription:
      "This module is the security backbone shared across my projects. It handles password hashing, session lifecycle, CSRF-safe forms, and a granular RBAC model where permissions are checked server-side on every route. The admin dashboard manages users, roles, and account states with full audit visibility.",
    technologies: ["Node.js", "Express.js", "MySQL", "bcrypt", "Express Session", "JavaScript"],
    category: "fullstack",
    image: "/images/project-authadmin.png",
    liveUrl: "#",
    sourceUrl: "https://github.com/",
    featured: true,
    highlights: [
      "bcrypt password hashing with salt rounds",
      "Session-based auth with idle and absolute timeouts",
      "Role-based access control enforced on every route",
      "Admin dashboard: user CRUD, role assignment, account lockout",
      "Server-side audit log of auth and admin actions",
    ],
    architecture: [
      { label: "Client", detail: "Login/register views + admin SPA-style dashboard" },
      { label: "API / Services", detail: "Express middleware chain: auth guard → RBAC guard → handler" },
      { label: "Data", detail: "MySQL — users, roles, permissions, sessions, audit_log" },
      { label: "Infra", detail: "bcrypt hashing, signed session cookies, rate-limited login endpoint" },
    ],
  },
  {
    id: 4,
    title: "Enterprise OSPF / Inter-VLAN Network Lab",
    subtitle: "Enterprise Routing & Switching Lab",
    description:
      "A multi-router enterprise lab topology implementing OSPF area design, inter-VLAN routing with router-on-a-stick, DHCP scopes, and documented verification — modeled on real campus network requirements.",
    longDescription:
      "This lab designs a small enterprise campus: VLANs 10/20/30 segmented by department, a Layer 3 switch performing inter-VLAN routing, and OSPF providing dynamic reachability across areas. Every design decision — subnet plan, OSPF areas, DHCP scopes — is documented alongside the show commands used to verify it.",
    technologies: ["Cisco IOS", "OSPF", "Inter-VLAN Routing", "DHCP", "VLSM", "Packet Tracer"],
    category: "networking",
    image: "/images/project-ospf-lab.png",
    liveUrl: "#",
    sourceUrl: "https://github.com/",
    featured: true,
    highlights: [
      "VLSM subnet plan across three departmental VLANs",
      "Router-on-a-stick inter-VLAN routing on a Layer 3 switch",
      "OSPF multi-area design with summarized routes",
      "DHCP scopes with per-VLAN pools and reservations",
      "Documented verification: show ip ospf neighbor, route tables, ping/traceroute",
    ],
    architecture: [
      { label: "Topology", detail: "3 routers, 1 L3 switch, access switches, 3 VLANs across 2 sites" },
      { label: "Routing", detail: "OSPF area 0 backbone + area 1 stub edge, route summarization at ABR" },
      { label: "Switching", detail: "802.1Q trunking, router-on-a-stick subinterfaces for inter-VLAN" },
      { label: "Services", detail: "DHCP per-VLAN pools, management VLAN, ACL on edge interfaces" },
    ],
  },
];

export default projects;
