const portfolioContent = {
  hero: {
    headline: ['Software', 'Engineer — AI,', 'Full-Stack & XR'],
    summary: 'I build AI products, full-stack applications, and immersive XR experiences with a focus on useful, deployable software.',
    status: 'XR Engineer at AIDL · BSCS DUET 2026 · Karachi · Open to freelance.',
    primaryAction: 'Get In Touch',
    secondaryAction: 'Download Resume',
  },
  about: {
    title: 'About Me',
    introductionTitle: 'Muhammad Fasih',
    introductionSubtitle: 'Software Engineer',
    introductionImageAlt: 'Developer workspace',
    introduction: [
      'Muhammad Fasih is a software engineer from Karachi, Pakistan, and a BS Computer Science graduate from Dawood University of Engineering & Technology.',
      'His work spans applied AI and computer vision, full-stack web products, Linux systems, and XR experiences.',
    ],
    experienceTitle: 'Experience',
    experience: [
      {
        role: 'XR Engineer',
        organization: 'AIDL',
        period: 'July 2026 – Present',
        description: 'Develops interactive VR and AR simulations with Vizard and Python, with 3D asset work in Blender.',
      },
      {
        role: 'Freelance Software Developer',
        organization: 'Fiverr · CS_Fasih',
        period: 'Ongoing',
        description: 'Builds AI/ML solutions, Python applications, and MERN web products for freelance clients.',
        url: 'https://fiverr.com/cs_fasih',
      },
    ],
    educationTitle: 'Education & Recognition',
    education: [
      {
        title: 'BS Computer Science',
        institution: 'Dawood University of Engineering & Technology (DUET)',
        date: 'Graduated May 2026',
      },
      {
        title: '3rd Place · FYDP Poster Competition',
        institution: 'GeoExtract · University Final Year Design Project',
        date: 'June 2026',
      },
    ],
    skillsTitle: 'Selected Skills',
    capabilitiesTitle: 'Areas of Focus',
    viewProjectsAction: 'View Featured Projects',
    skillGroups: [
      {
        title: 'AI / ML',
        skills: ['Python', 'PyTorch', 'YOLO', 'LoRA fine-tuning', 'FastAPI', 'Modal', 'Neo4j'],
      },
      {
        title: 'Web',
        skills: ['MERN', 'Next.js', 'TypeScript', 'Supabase', 'PostgreSQL'],
      },
      {
        title: 'Systems / Security',
        skills: ['C/POSIX', 'Linux', 'ClamAV', 'auditd', 'Docker'],
      },
      {
        title: 'XR / 3D',
        skills: ['Unity', 'Vizard', 'Blender', 'Python'],
      },
    ],
    capabilities: [
      {
        number: '01',
        title: 'AI & Machine Learning',
        description: 'Computer vision, vision-language models, fine-tuning, and model-backed applications.',
      },
      {
        number: '02',
        title: 'Full-Stack Development',
        description: 'MERN and Next.js applications, APIs, relational data, and cloud deployment.',
      },
      {
        number: '03',
        title: 'XR & Systems',
        description: 'Interactive VR/AR experiences, Linux systems programming, and endpoint security.',
      },
    ],
  },
  work: {
    title: 'Featured Work',
    description: 'Selected AI, full-stack, systems, and XR projects, with public repositories linked where available.',
    finalYearProjectLabel: 'Final Year Project',
    awardLabel: 'Recognition',
    closedSourceLabel: 'Closed Source',
    missingLinkLabel: 'TODO: confirm a public project link',
    missingImageLabel: 'TODO: add a project image',
    authorName: 'Muhammad Fasih',
    authorMark: 'MF',
    githubLinkLabel: 'GitHub',
    liveLinkLabel: 'Live Demo',
  },
  archive: {
    title: 'Archive / More Projects',
    description: 'Additional work across AI, web development, systems programming, and 3D.',
    missingLinkLabel: 'TODO: confirm a public repository link',
    githubLinkLabel: 'GitHub',
    liveLinkLabel: 'Live Demo',
  },
  contact: {
    title: 'Contact',
    description: 'Have a project in mind or want to collaborate? Send a message or get in touch by email.',
    email: 'muhammadfasih146@gmail.com',
    emailLabel: 'Email Muhammad Fasih',
    fields: {
      name: 'Your Name',
      email: 'Your Email',
      subject: 'Subject',
      message: 'Your Message',
      honeypot: 'Leave this field empty',
    },
    submitLabel: 'Send Message',
    sendingLabel: 'Sending...',
    sentMessage: "Message sent successfully! I'll get back to you soon.",
    errorFallback: 'Something went wrong. Please try again or email me directly.',
    unavailablePrefix: 'Server unavailable. Please email me at ',
  },
  footer: {
    description: 'Building software across AI, web, systems, and XR.',
    firstName: 'Muhammad',
    lastName: 'Fasih',
    homepageLabel: 'Muhammad Fasih — homepage',
    socialLinks: [
      { label: 'GitHub', href: 'https://github.com/CS-Fasih', icon: 'github' },
      { label: 'LinkedIn', href: 'https://linkedin.com/in/muhammad-fasih-19f', icon: 'linkedin' },
      { label: 'Fiverr', href: 'https://fiverr.com/cs_fasih', icon: 'fiverr' },
      { label: 'Email', href: 'mailto:muhammadfasih146@gmail.com', icon: 'email' },
    ],
    quickLinksTitle: 'Quick Links',
    quickLinks: [
      { label: 'Work', to: '/#work', sectionId: 'work' },
      { label: 'My Activity', to: '/activity' },
      { label: 'Contact', to: '/#contact', sectionId: 'contact' },
    ],
    contactTitle: 'Get In Touch',
    email: 'muhammadfasih146@gmail.com',
    copyrightName: 'Muhammad Fasih',
  },
};

export default portfolioContent;
