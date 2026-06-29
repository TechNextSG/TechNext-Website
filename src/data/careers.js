// Open roles across TechNext's APAC hubs.
// Ported from the careers.html prototype (TechNextSG/TechNext-Website).

export const ROLES = [
  {
    slug: 'ai-engineer',
    name: 'AI Engineer',
    sub: '',
    dept: 'Engineering',
    country: 'vietnam',
    color: 'yellow',
    short:
      'Design, build, and deploy production AI systems — agents, fine-tuned models, and inference pipelines serving enterprise clients globally.',
    body: `You'll work across the full AI delivery lifecycle, from architecture and prototyping through to production monitoring and iteration.

We expect you to be comfortable with LangChain, the Anthropic / OpenAI APIs, vector databases, and the engineering tradeoffs between agent designs. You'll partner with our context engineers, our infra team, and our delivery leads on real client work.`,
    must: [
      '3+ years building backend systems (Python, TypeScript, or Go)',
      'Production experience with at least one major LLM provider',
      'Comfortable with retrieval-augmented generation, evaluation, and observability',
      'English-first written communication',
    ],
  },
  {
    slug: 'devops-llm',
    name: 'DevOps Engineer',
    sub: 'Local LLM Focus',
    dept: 'Infrastructure',
    country: 'vietnam',
    color: 'blue',
    short:
      'Own the infrastructure for running local LLMs at scale — GPU clusters, inference servers, and AI-optimized deployment pipelines.',
    body: `You'll ensure our self-hosted AI systems are fast, reliable, and cost-efficient across multiple client environments — both in our SG/VN data centres and inside customer VPCs.

This role sits at the intersection of MLOps, classic SRE, and platform engineering. You ship Helm charts, Terraform, and observability dashboards rather than ad-hoc scripts.`,
    must: [
      '3+ years operating production Kubernetes',
      'Experience with vLLM, TGI, Triton, or comparable LLM-serving stacks',
      'Solid Linux + networking fundamentals; Terraform / Pulumi a plus',
      'You believe a runbook is part of the deliverable',
    ],
  },
  {
    slug: 'context-engineer',
    name: 'Context Engineer',
    sub: '',
    dept: 'AI Systems',
    country: 'vietnam',
    color: 'pink',
    short:
      'Design and optimise prompts, RAG architectures, and AI context systems that make enterprise AI reliable at scale.',
    body: `You own the space between the model and the product — from retrieval strategy to evaluation frameworks that prove quality objectively.

This is a rare hybrid role: part engineer, part editor, part scientist. You'll write evals as readily as you write prompts, and you'll spar with our AI engineers about which knobs to turn first.`,
    must: [
      '2+ years working hands-on with LLM applications',
      'Strong written reasoning and a portfolio of prompt / eval work',
      'Comfort with Python and at least one vector DB',
    ],
  },
  {
    slug: 'iot-engineer',
    name: 'IoT Engineer',
    sub: '',
    dept: 'Engineering',
    country: 'vietnam',
    color: 'peach',
    short:
      'Connect physical devices and sensors to our AI platform — building edge intelligence and IoT-to-cloud pipelines for enterprise environments.',
    body: `Your work bridges the physical and digital worlds, delivering real-time data to AI systems that drive business decisions in logistics, manufacturing, and healthcare.

You'll work with MQTT, edge inference frameworks, and our Odoo+AI stack to integrate sensor data into client operations.`,
    must: [
      'Experience with embedded development (C/C++, Rust, or MicroPython)',
      'Familiarity with MQTT and at least one cloud IoT platform',
      'Comfort with Linux at the device level',
    ],
  },
  {
    slug: 'ai-qa-engineer',
    name: 'AI Reliability & QA Engineer',
    sub: '',
    dept: 'Quality',
    country: 'vietnam',
    color: 'green',
    short:
      'Ensure AI systems behave reliably in production — designing evaluation frameworks and monitoring AI output quality at scale.',
    body: `Traditional QA doesn't map cleanly to probabilistic AI systems. You'll build the testing tooling, metrics, and processes that give TechNext and its clients real confidence in every deployment.

You'll work alongside AI engineers and context engineers to define what "good" means, and then prove it.`,
    must: [
      'QA or SRE background with at least one production system',
      'Familiarity with Python testing tools and CI',
      'Willingness to learn the LLM eval landscape (Ragas, LangSmith, custom suites)',
    ],
  },
  {
    slug: 'automation-engineer',
    name: 'Automation Engineer',
    sub: '',
    dept: 'Engineering',
    country: 'vietnam',
    color: 'lavender',
    short:
      'Build intelligent workflow automations using AI, Odoo, and integration platforms — connecting the systems that power enterprise operations.',
    body: `You'll eliminate manual processes at scale, turning business workflows into automated pipelines that deliver measurable ROI for global clients.

Expect to work across n8n, Zapier-style platforms, Odoo, and bespoke Python integrations — picking the right tool for the job.`,
    must: [
      'Experience with at least one workflow / iPaaS platform',
      'Python or JavaScript for glue code',
      'Strong intuition for business process design',
    ],
  },
  {
    slug: 'it-manager',
    name: 'IT Manager',
    sub: '',
    dept: 'Engineering',
    country: 'vietnam',
    color: 'blue',
    short:
      'Lead IT operations across TechNext\'s global dev hub network — systems security, infrastructure management, and ISO 27001 alignment.',
    body: `You'll be the person who keeps our internal systems secure and our engineering teams unblocked across multiple time zones.

This is a player-coach role — expect to be both shipping policies and getting hands-on with our identity and endpoint tooling.`,
    must: [
      '5+ years IT operations or systems administration',
      'Experience preparing an organisation for ISO 27001 or SOC 2',
      'Comfort with Google Workspace, identity providers, and MDM',
    ],
  },
  {
    slug: 'caito',
    name: 'CAITO',
    sub: 'Chief AI & Technology Officer',
    dept: 'Leadership',
    country: 'vietnam',
    color: 'yellow',
    short:
      'Lead TechNext\'s overall AI strategy, technology roadmap, and engineering culture across global clients.',
    body: `You'll define how we build and scale AI systems, partner with the CEO and COO to shape TechNext's technical identity at an inflection point in its growth, and own the hiring bar for senior engineers.

This is a senior leadership role with full ownership of technical direction, hiring, and architecture decisions.`,
    must: [
      '10+ years building and leading engineering teams',
      'Track record shipping AI/ML systems in production',
      'Comfort moving between strategy, code review, and client-facing meetings',
    ],
  },
  {
    slug: 'odoo-consultant',
    name: 'Functional ERP / Odoo Consultant',
    sub: '',
    dept: 'ERP',
    country: 'philippines',
    color: 'green',
    short:
      'Implement, configure, and customise Odoo ERP solutions for enterprise clients — bridging business requirements and technical delivery across the engagement.',
    body: `You'll run discovery, scope modules, configure flows, and partner with developers on the harder customisations.

Most engagements span Sales, Purchase, Inventory, Manufacturing, Accounting, and HR. You should be comfortable training end users and writing functional specs that developers can implement without ambiguity.`,
    must: [
      '3+ years implementing Odoo (v15+) end-to-end',
      'Experience with at least 4 standard Odoo modules in production',
      'English fluency and consulting-grade written communication',
    ],
  },
  {
    slug: 'project-manager-erp',
    name: 'Project Manager',
    sub: 'ERP / Odoo Focus',
    dept: 'Management',
    country: 'philippines',
    color: 'lavender',
    short:
      'Lead end-to-end Odoo ERP implementation projects — coordinating between clients, developers, and functional consultants to deliver on scope, time, and budget.',
    body: `You own the engagement from kickoff through to go-live and hypercare. Expect to run weekly client steerings, manage risk logs, and coordinate across our SG/VN/PH hubs.`,
    must: [
      '4+ years managing software or ERP delivery projects',
      'Familiarity with Odoo, Jira / Linear, and stakeholder management',
      'Calm under client pressure',
    ],
  },
  {
    slug: 'b2b-sales',
    name: 'Senior B2B Sales Consultant',
    sub: '',
    dept: 'Sales',
    country: 'philippines',
    color: 'pink',
    short:
      'Drive enterprise sales across TechNext\'s AI and ERP solutions — owning the full B2B sales cycle with a focus on long-term partnerships.',
    body: `You'll work directly with founder leadership on pipeline strategy, run discovery with prospective clients, and close USD 25K–250K engagements.

Expect a meaningful base + uncapped commission, and a real say in how we shape the offer.`,
    must: [
      '5+ years B2B SaaS or services sales',
      'Comfortable with longer-cycle enterprise deals',
      'Track record of consistently hitting quota',
    ],
  },
  {
    slug: 'client-success',
    name: 'Client Success Manager',
    sub: '',
    dept: 'Client Success',
    country: 'philippines',
    color: 'peach',
    short:
      'Own the post-sale relationship with TechNext\'s ERP and AI clients — driving adoption, retention, and expansion.',
    body: `You'll act as the client's advocate inside TechNext and TechNext's advocate inside the client. Expect a mix of QBRs, account growth plans, and hands-on support escalation.`,
    must: [
      '3+ years in client success or account management',
      'Familiarity with ERP or B2B SaaS account dynamics',
      'Strong written and spoken English',
    ],
  },
  {
    slug: 'accountant-ph',
    name: 'Accountant',
    sub: '',
    dept: 'Finance',
    country: 'philippines',
    color: 'green',
    short:
      'Manage financial records, reporting, and compliance for TechNext\'s Philippines operations — supporting regional growth with accurate, timely reporting.',
    body: `You'll own bookkeeping, payroll coordination, and statutory filings for the PH entity, with reporting lines into the SG HQ finance lead.`,
    must: [
      'CPA-track or equivalent',
      '3+ years in accounting (preferably tech or services)',
      'Comfort with Xero, QuickBooks, or Odoo Accounting',
    ],
  },
  {
    slug: 'sales-associate',
    name: 'Sales Associate',
    sub: '',
    dept: 'Sales',
    country: 'philippines',
    color: 'pink',
    short:
      'Support the sales team in lead generation, outreach, and pipeline management — building relationships with potential clients across APAC.',
    body: `An entry- to mid-level sales role with a clear growth path into senior consultant work. You'll run outbound, qualify inbound, and own SDR-style follow-up.`,
    must: [
      '1–2 years sales or business development experience',
      'Comfort with CRM tools (HubSpot, Pipedrive, or similar)',
      'Coachable and metric-driven',
    ],
  },
]

export const COUNTRIES = [
  { id: 'all', label: 'All Countries', flag: '🌏' },
  { id: 'vietnam', label: 'Vietnam', flag: '🇻🇳' },
  { id: 'philippines', label: 'Philippines', flag: '🇵🇭' },
  { id: 'singapore', label: 'Singapore', flag: '🇸🇬' },
]

export const DEPARTMENTS = [
  'All Roles', 'Engineering', 'AI Systems', 'Infrastructure', 'Leadership',
  'Quality', 'Finance', 'ERP', 'Sales', 'Client Success', 'Management',
]

export function getRole(slug) {
  return ROLES.find((r) => r.slug === slug) || null
}
