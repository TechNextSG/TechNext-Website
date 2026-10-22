# -*- coding: utf-8 -*-
"""TechNext advisors on /advisors (client-facing, indexed).

ADVISORS: one entry per named advisor, in display order. Leave it EMPTY until the owner sends real details: nothing is
invented. While it is empty the "Meet the advisors" section is not rendered at all. Fields:
  name, role (e.g. "Lead Odoo consultant · Finance"), office ("sg" | "ph" | "vn"), photo (file in assets/img/team/,
  square, ideally 600x600 WebP; without one the card shows initials), years (int or None), focus (list of expertise
  keys from EXPERTISE below), creds (list of short credentials, e.g. "Odoo 18 Functional certification"), bio (one or
  two sentences), linkedin (URL or None).

EXPERTISE: the advisory practices, shown as role cards whether or not named advisors are listed yet.
"""

# Home-page profiles (owner 22 Oct 2026: skills only, no companies; photos come later, initials until then).
# Sources: CVs of AJ Cubilla, Jeric Bulayungan and RJ (Raphael John) Sarreal; names and roles as the owner gave them; Philip Gallan's skill list and Clement Kho's
# profile as sent by the owner. Fields: name, role, office (sg | ph | vn | None), photo (assets/img/team/, 600x600 WebP),
# email (work address, shown on the Team Directory only), summary (one line for the home card), bio (no pronouns; the profile page), stats [(value, label)], groups [(label, [skills])] (the first shows, the rest open under
# "See all N skills"), apps (Odoo app keys, flat icons), creds (certifications and degrees). Plain text; build.py escapes it.
ADVISORS = [
    {"name": "Clement Kho", "role": "CEO", "office": "sg", "email": "sky@technext.asia", "photo": "clement-kho.webp",
     "summary": "Clement builds companies across borders and has hired and trained more than 1,000 people.",
     "bio": "Clement builds companies across borders, from regional headquarters in Singapore to European operations and manufacturing in China and Hong Kong. Along the way Clement has hired and trained more than 1,000 people, and led automation projects where thousands of everyday tasks now run by themselves. Ask Clement about running several companies on one system.",
     "stats": [("1,000+", "staff hired and trained"), ("724", "staff in one BPO set-up"), ("10+", "Wi-Fi and network security projects")],
     "groups": [
         ("Strategy & operations", ["Global strategy", "Singapore regional headquarters", "Multi-company operations", "Europe-centred operations", "China and Hong Kong manufacturing"]),
         ("Automation & digital twin", ["Office automation", "Dashboards", "Digital twins", "Thousands of automations", "Building management linked to field service", "Energy and air-quality sensors", "Webhooks and web sockets", "Integrating thousands of devices"]),
         ("People & set-up", ["BPO set-up in second-tier cities", "Office, equipment and IT set-up", "Hiring and training 1,000+ staff", "Team management"]),
         ("Infrastructure", ["Wi-Fi networks", "Network security", "Server racks, home lab and NAS"]),
     ],
     "creds": ["MSc Marketing", "Cybersecurity and data protection certification"]},
    {"name": "Astroneil Matan", "role": "Senior Functional Lead", "office": "ph", "photo": "astroneil-matan.webp", "email": "astroneil@technext.asia",
     "summary": "Astroneil has helped companies move onto ERP for 24 years, ten of them on Odoo.",
     "bio": "Astroneil has spent 24 years helping companies move onto ERP and CRM systems, ten of them on Odoo. Astroneil sits down with your finance and operations teams, maps how the work really happens, and turns it into a set-up that fits, from data migration to local tax and multi-currency. Ask Astroneil about moving off another ERP without losing your history.",
     "stats": [("24+", "years in ERP and CRM"), ("10", "years on Odoo"), ("30", "projects in the portfolio")],
     "groups": [
         ("Functional leadership", ["Discovery workshops and scoping", "Business process re-engineering", "Finance and supply chain workflows", "Data migration strategy", "Localisation: tax, currency, multi-entity", "Change management and user adoption", "UAT and quality assurance"]),
         ("ERP & CRM platforms", ["Odoo ERP (10 years)", "Acumatica ERP (14 years)", "SAP Business One, ECC and S/4HANA", "Microsoft Dynamics 365 BC, AX, NAV and SL", "Oracle NetSuite and Fusion", "Salesforce and ServiceNow", "Shopify"]),
         ("Project delivery", ["Agile and Scrum delivery", "Multi-regional roll-outs", "Vendor and SLA management", "Jira, Confluence, Asana and Microsoft Project"]),
         ("Governance & compliance", ["BSP regulatory reporting", "SOX, AMLC and PCI-DSS controls", "GDPR data privacy"]),
         ("Industries", ["Manufacturing", "Food processing and restaurants", "Retail and distribution", "Construction", "Property management", "Hospitality", "Banking and lending", "Audit and accounting firms"]),
         ("Technical", ["Python, C# and SQL", "AWS, Azure and Google Cloud", "Power BI and Tableau"]),
     ],
     "creds": ["Accredited Project Manager (IO4PM)", "Accredited Scrum Master (International Scrum Institute)", "Six Sigma Green Belt (International Six Sigma Institute)", "Agile Project Management Practitioner (HP LIFE)", "BS Computer Science", "BS Business Administration"]},
    {"name": "RJ Sarreal", "role": "Project Manager", "office": "ph", "photo": "rj-sarreal.webp", "email": "rj@technext.asia",
     "summary": "RJ has run ERP projects for 17 years and keeps every sprint on track.",
     "bio": "RJ has run ERP projects for 17 years, on Microsoft Dynamics, Oracle and NetSuite. RJ writes down exactly what you need, agrees the scope and timeline with you, and keeps every sprint on track, so you always know where your project stands. RJ has also prepared POS accreditation applications for the BIR and Philippine malls.",
     "stats": [("17", "years in ERP"), ("4", "NetSuite certificates"), ("20+", "client projects")],
     "groups": [
         ("BIR & POS", ["POS accreditation applications to the BIR", "POS accreditation for Philippine malls", "POS functional and technical support"]),
         ("ERP platforms", ["Microsoft Dynamics SL (Solomon)", "Microsoft Dynamics NAV", "Oracle Fusion", "Oracle NetSuite", "SAP Workforce time and attendance"]),
         ("Project management", ["Feature estimates", "Business requirements (BRD)", "Proposals and kick-off", "Timelines and weekly updates", "Sprints and backlog (Jira, Backlog)", "Change-request control", "Meeting minutes"]),
         ("ERP modules", ["General ledger", "Accounts payable", "Accounts receivable", "Cash", "Inventory", "Requisitions and purchasing", "Order management", "Sales orders"]),
         ("Custom work", ["Custom reports", "Custom screens", "Functional and technical support"]),
         ("Industries", ["Energy and utilities", "Banking", "Retail", "Food and consumer goods", "Manufacturing", "Education", "Automotive"]),
     ],
     "creds": ["NetSuite ERP Fundamentals", "NetSuite WMS Fundamentals", "NetSuite Essentials", "NetSuite Administrator Essentials", "BS Business Administration"]},
    {"name": "Philip Gallan", "role": "Odoo Developer Expert", "office": "ph", "email": "phillip@technext.asia", "photo": "philip-gallan.webp",
     "summary": "Philip builds and connects Odoo on every version from 14 to 19.",
     "bio": "Philip builds the parts of Odoo you can't get off the shelf, on every version from 14 to 19. When your Odoo needs to talk to another system, through an API or an EDI feed, Philip connects it, deploys it and keeps it running.",
     "stats": [("6", "Odoo versions"), ("4", "databases"), ("9", "languages and frameworks")],
     "groups": [
         ("Odoo", ["Odoo 14, 15, 16, 17, 18 and 19", "Owl components", "Odoo ORM", "Odoo API"]),
         ("Languages & frameworks", ["Python", "Django", "PHP", "JavaScript", "TypeScript", "React", "Node.js", "Express.js", "Next.js", "Jinja2", "Celery", "PyQt", "jQuery", "HTML and XML"]),
         ("Integrations & APIs", ["REST APIs", "GraphQL and Apollo", "Socket.IO", "ChatGPT API", "Google Maps and Leaflet", "EDI over SFTP", "JWT and cookie authentication", "Scrapy, BeautifulSoup and Selenium"]),
         ("Data", ["PostgreSQL", "MySQL", "Supabase", "MongoDB, Compass and Mongoose", "Redis and django-redis"]),
         ("Deployment & operations", ["Docker", "Kubernetes", "DigitalOcean", "Vercel", "Render", "Heroku", "Nginx and Caddy", "Linux and UNIX shell scripting", "SSL certificates (OpenSSL)", "PM2 and Node cluster", "AWS S3 and Cloudinary", "Ngrok tunnelling", "IP networking", "Microsoft 365 administration"]),
         ("Front end", ["React Context, Redux and React Query", "Tailwind CSS", "Sass", "Material UI", "shadcn/ui", "Bootstrap", "Vanilla CSS"]),
         ("Testing & delivery", ["Python unit testing", "Jest", "Postman", "Git and GitHub", "Jira and Bitbucket", "Agile delivery", "pip, npm and Babel", "VS Code, PyCharm, Sublime Text and Vim", "Microsoft Office"]),
         ("AI", ["Prompting ChatGPT, Claude, Gemini and DeepSeek"]),
         ("Design & media", ["Photoshop", "Illustrator", "Premiere Pro", "After Effects"]),
     ],
     "creds": []},
    {"name": "AJ Cubilla", "role": "Odoo Developer Expert", "office": "ph", "email": "dev@technext.asia", "photo": "aj-cubilla.webp",
     "summary": "AJ builds and supports Odoo solutions for clients across many industries.",
     "bio": "AJ works hand in hand with Odoo clients across many industries, listening to what each team needs, building the solution, and staying on to support it. AJ codes in Python, JavaScript and PostgreSQL, and trains partner teams to run their systems day to day.",
     "stats": [("2022", "with Odoo clients since"), ("3", "core technologies")],
     "groups": [
         ("Odoo client work", ["Solution design for clients", "Needs analysis", "Client support and maintenance", "Database administration", "Partner network training"]),
         ("Development", ["Python", "JavaScript", "PostgreSQL", "Front-end and back-end coding", "Web design and landing pages", "Feature testing"]),
         ("Systems", ["POS systems"]),
         ("Working style", ["Time management and organisation", "Client communication", "Eye for detail"]),
     ],
     "creds": ["BS Computer Science, Dean's Lister"]},
    {"name": "Jeric Bulayungan", "role": "Business Development", "office": "ph", "photo": "jeric-bulayungan.webp", "email": "jeric@technext.asia",
     "summary": "Jeric has helped Philippine businesses choose their software since 2016.",
     "bio": "Jeric has helped Philippine businesses choose their business software since 2016, from SAP and QuickBooks to point-of-sale systems. Jeric is often your first conversation with TechNext: listening to how your business runs today, then bringing in the right people from the team.",
     "stats": [("2016", "in B2B software sales since"), ("10+", "software products sold")],
     "groups": [
         ("Sales", ["B2B solution selling", "Pipeline management", "Lead generation", "Account management and development", "Revenue forecasting", "Sales reporting", "Online seminars and demos", "Outbound prospecting"]),
         ("Systems sold", ["SAP S/4HANA", "SAP Business One", "QuickBooks", "ABSS (MYOB)", "Sage 50", "Retail Pro", "Aloha POS", "Freshworks", "monday.com", "WASP warehouse and asset management", "Payroll systems", "IT infrastructure"]),
         ("Leadership", ["Sales team training", "Staff management", "Performance management"]),
         ("Tools", ["CRM software", "Microsoft Office", "Data mining"]),
     ],
     "creds": ["BS Information Technology"]},
    {"name": "Rico Duque", "role": "Marketing Officer", "office": "ph", "photo": "rico-duque.webp",
     "summary": "Rico designs, structures and optimises websites, runs social media and keeps every brand consistent.",
     "bio": "Rico runs marketing end to end, from website design, structure and SEO to social media and brand design. Since 2019 Rico has planned social media strategies, written SEO-driven articles and reported campaigns from analytics, and now brings AI tools such as Claude, Gemini and Luma AI into the content workflow so more gets made, faster.",
     "stats": [("2019", "in social media since"), ("15", "digital and AI tools"), ("5", "social accounts at once")],
     "groups": [
         ("Website design & SEO", ["Website design and management", "Site structure and navigation", "On-page SEO", "SEO-driven articles and blogs", "Content optimisation", "User experience improvements", "Google Analytics reporting"]),
         ("AI integration & workflow", ["AI in marketing workflows", "AI prompt engineering (GPT-based models)", "Generative AI: Claude, Gemini, Luma AI", "Workflow management", "Project tracking (ShotGrid)", "Google Workspace"]),
         ("Branding & design", ["Brand identity and consistency", "Marketing graphics (Canva, Photoshop)", "Campaign visuals and presentations", "Reels, GIFs and animated video", "Video editing (CapCut, Filmora, Premiere Pro)"]),
         ("Social media management", ["Social media strategy", "Content calendars and scheduling (Buffer)", "Meta Business Suite", "Facebook ads", "Performance analytics and reporting", "Community engagement"]),
         ("Email & campaigns", ["Email marketing (Brevo)", "Facebook and email campaigns", "Data-driven marketing strategy", "Event planning and coordination"]),
         ("Industries", ["Travel", "Animation and media", "Data services"]),
     ],
     "creds": ["BS Business Administration, Operations Management"]},
]

OFFICES = {"sg": "Singapore HQ", "ph": "Taguig City hub", "vn": "Ho Chi Minh City hub"}

EXPERTISE = [
    {"key": "finance", "role": "Finance & accounting adviser", "odoo": ["accountant", "account"],
     "lead": "For the people who close the month. How the books, banks and tax should run once everything is in one database.",
     "advise": ["Chart of accounts and journals that fit how you report", "Bank feeds, reconciliation and a shorter month-end",
                "Government compliance: BIR in the Philippines, GST and InvoiceNow in Singapore", "Multi-currency, multi-company and what to migrate"],
     "ask": "Which reports does your accountant or auditor ask for every month, and how long do they take today?",
     "href": "odoo/apps/accountant.html", "link": "Odoo Accounting"},
    {"key": "sales", "role": "Sales, CRM & service adviser", "odoo": ["crm", "sale", "helpdesk"],
     "lead": "For the path from first enquiry to paid invoice, and the support that follows.",
     "advise": ["Pipeline stages that match how your team really sells", "Pricelists, discounts and approval rules on quotations",
                "Invoicing on order, on delivery or by milestone", "Helpdesk and after-sales on the same customer record"],
     "ask": "Where does a quotation wait the longest before the customer says yes?",
     "href": "odoo/crm-development.html", "link": "CRM development"},
    {"key": "supply", "role": "Supply chain & inventory adviser", "odoo": ["stock", "purchase"],
     "lead": "For stock you can trust: what you hold, where it is, and when to buy more.",
     "advise": ["Warehouses, locations and routes for receipts and picking", "Reordering rules that raise purchase orders on time",
                "Lots, serial numbers and expiry dates where you need them", "Barcode scanning on the warehouse floor"],
     "ask": "How do you find out a product has run out: from the system, or from a customer?",
     "href": "odoo/apps/stock.html", "link": "Odoo Inventory"},
    {"key": "operations", "role": "Manufacturing & projects adviser", "odoo": ["mrp", "project"],
     "lead": "For businesses that make things or deliver jobs, where cost per unit or per project decides the margin.",
     "advise": ["Bills of materials, work orders and real unit cost", "Job costing per project, timesheets and subcontractors",
                "Progress billing, retention and milestone invoices", "Planning people and machines without a whiteboard"],
     "ask": "Do you know the real margin on your last finished job, and how long did it take to work out?",
     "href": "solutions/enterprise.html", "link": "Enterprise solution"},
    {"key": "ai", "role": "AI & automation adviser", "odoo": ["ai_app"],
     "lead": "For deciding where AI genuinely saves hours, and where a plain Odoo rule does the job better.",
     "advise": ["Which repetitive tasks to automate first", "Knowledge assistants that answer from your own documents",
                "Agents and chatbots that hand off to a person", "Running AI on your data with your access rules"],
     "ask": "Which question does your team answer by hand more than ten times a day?",
     "href": "odoo/ai-integration.html", "link": "AI integration"},
    {"key": "digital", "role": "Website & brand adviser", "odoo": ["website"],
     "lead": "For the face of the business: a website and brand that run on the same system as your sales.",
     "advise": ["Website structure built around what customers ask", "Forms that land straight in your CRM pipeline",
                "Brand assets your team can reuse without a designer", "Online store tied to real stock and prices"],
     "ask": "What do customers ask you most before they buy, and is the answer on your website?",
     "href": "solutions/website.html", "link": "Web design"},
]


APP_NAMES = {"accountant": "Accounting", "account": "Invoicing", "hr_payroll": "Payroll", "documents": "Documents", "sale": "Sales",
             "stock": "Inventory", "point_of_sale": "Point of Sale", "purchase": "Purchase", "crm": "CRM", "ai_app": "AI",
             "website": "Website", "knowledge": "Knowledge", "helpdesk": "Helpdesk", "mrp": "Manufacturing", "project": "Project",
             "hr": "Employees", "sale_subscription": "Subscriptions", "website_sale": "eCommerce", "spreadsheet_dashboard": "Dashboards"}


# Design previews only (build with TN_PREVIEW_PROFILES=1). Clearly fake; never shown on the live site.
# Home-page profile fields (owner 22 Oct 2026: no company list, more on skills): name, role, office, photo, bio,
#   apps (Odoo app keys, shown with their flat icons), bir (BIR & compliance skills), skills (implementation skills),
#   industries, creds (certifications). Every list is optional; an empty group is not shown.
PREVIEW_PLACEHOLDERS = [
    {"name": "Adviser Name", "role": "Finance & BIR compliance adviser", "office": "ph",
     "bio": "One or two sentences from the CV.",
     "apps": ["accountant", "account", "hr_payroll", "documents"],
     "bir": ["CAS / CBA registration", "2307 and withholding (ATC codes)", "SLSP, SAWT and QAP", "2550Q VAT summary", "E-invoicing set-up", "Audit and LOA preparation"],
     "skills": ["Chart of accounts design", "Opening balances", "Month-end close", "Finance team training"],
     "industries": ["Retail", "Construction", "Medical"],
     "creds": ["Certification from the CV"]},
    {"name": "Consultant Name", "role": "Lead Odoo consultant", "office": "ph",
     "bio": "One or two sentences from the CV.",
     "apps": ["sale", "stock", "point_of_sale", "purchase", "crm"],
     "bir": ["EOPT invoice fields", "POS receipts and invoices", "Branch invoice series"],
     "skills": ["Process mapping", "Data migration", "User acceptance testing", "Go-live and hypercare"],
     "industries": ["Retail", "F&amp;B", "Ecommerce"],
     "creds": ["Certification from the CV"]},
    {"name": "Engineer Name", "role": "AI & integration engineer", "office": "vn",
     "bio": "One or two sentences from the CV.",
     "apps": ["ai_app", "website", "knowledge", "helpdesk"],
     "bir": ["E-invoicing link build and testing", "DAT file exports"],
     "skills": ["Odoo integrations and API", "Custom modules", "Workflow automation", "Testing on a copy of your database"],
     "industries": ["Manufacturing", "Travel"],
     "creds": ["Certification from the CV"]},
]
